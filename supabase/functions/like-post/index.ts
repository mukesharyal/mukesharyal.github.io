// Deno imports
import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
// Supabase Client import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// We must explicitly import FormData if we use it outside of the global scope, 
// but since Deno makes it global, we can rely on it being available.
// However, the standard Deno URL for node/form_data should be changed if possible 
// to ensure the latest Deno compatibility, but we will stick to the global usage 
// as is intended for the Edge Function runtime, only correcting the secret name.

// --- SETUP ---

// Initialize Supabase Admin Client with Service Role Key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! 
);

// Helper for consistent JSON responses
const jsonResponse = (data: any, status = 200) => 
  new Response(JSON.stringify(data), { 
    status, 
    headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    } 
  });

// --- TURNSTILE VERIFICATION ---

/**
 * Calls the Cloudflare Siteverify API to validate the token.
 * @param token The cf-turnstile-response token from the client.
 * @returns true if human, false if bot or token is invalid.
 */
async function verifyTurnstile(token: string): Promise<boolean> {

    const secretKey = Deno.env.get('CAPTCHA_SECRET_KEY'); 

    if (!secretKey) {
        console.error("CAPTCHA_SECRET_KEY not set!"); // Updated log message
        return false; // Fail safe if secret is missing
    }
    
    // Cloudflare requires the payload to be sent as 'multipart/form-data'
    // FormData is available globally in the Deno runtime (Web API standard)
    const verificationData = new FormData();
    verificationData.append('secret', secretKey);
    verificationData.append('response', token);

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: verificationData,
        });

        const result = await response.json();
        
        if (!result.success) {
            console.error("Turnstile failed:", result["error-codes"]);
        }
        
        return result.success;

    } catch (error) {
        console.error("Turnstile verification failed due to network error:", error);
        return false;
    }
}


// --- MAIN HANDLER ---

serve(async (req: Request) => {
    const url = new URL(req.url);
    // Note: The endpoint path is stripped to just the function name 'post-api'
    // For routing, we should use a query parameter or path segment.
    // Given the current structure, routing is done by checking the URL pathname.

    // We will keep the current endpoint parsing logic, assuming the client hits the base function URL:
    // https://[ID].supabase.co/functions/v1/post-api
    // and the endpoint is derived from the query string or body/method, 
    // but since the current code routes based on method and body content, we'll keep the existing structure,
    // assuming 'numLikes', 'incrementLike', 'decrementLike' are passed in the body or are the final path segment 
    // when using complex routing.
    // Since the client call uses invoke('post-api', { body: { endpoint: 'numLikes' } }), the routing needs to adapt.
    
    // CURRENT LOGIC ASSUMES ENDPOINT IS THE FINAL PATH SEGMENT:
    const pathSegments = url.pathname.split('/');
    // 'post-api' is the second-to-last segment if the URL is like /functions/v1/post-api
    // We'll rely on the client or environment to resolve the path for the endpoint check below.
    const endpoint = pathSegments[pathSegments.length - 1]; 
    // NOTE: Given the original code: url.pathname.split('/v1/')[1] will be 'post-api'. 
    // This makes routing unreliable. The code below assumes we are checking the logic's intended routes.
    
    // Let's assume the previous code intended for endpoint to be the function name, 
    // and the client is actually sending the action in the body.
    // However, to make the GET work, we must rely on the query parameter being checked inside the block.


    // Handle CORS OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow any origin
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow the methods you use
                'Content-Length': '0',
            },
        });
    }


    // ----------------------------------------------------
    // 1. /numLikes (GET) - Public Read Endpoint
    // ----------------------------------------------------
    // The previous code was correct to check the query parameters inside the block.
    // The endpoint variable here is unreliable, but the logic inside the block is sound.
    if (req.method === 'GET') { 
        // We look for the post_name query param here.
        const postName = url.searchParams.get('post_name');
        
        // We must check if the client is asking for numLikes via a different param/path, 
        // but for simplicity, we assume any GET is a read request on this function.
        if (!postName) return jsonResponse({ error: 'Missing post_name' }, 400);

        const { data, error } = await supabaseAdmin
            .from('post_likes')
            .select('num_likes')
            .eq('post_name', postName)
            .single();

        // PGRST116 means 'no rows found'
        if (error && error.code !== 'PGRST116') {
             console.error("DB Read Error:", error);
             return jsonResponse({ error: 'Database read error' }, 500);
        }

        // Return 0 if no row exists, otherwise return the count
        return jsonResponse({ num_likes: data ? data.num_likes : 0 });
    }
    
    // Requests below require POST and CAPTCHA verification
    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    // Parse JSON body, handle errors if body is missing/invalid
    const payload = await req.json().catch(() => ({}));
    
    // We must rely on the client sending the action in the body to route POST requests.
    const postAction = payload.endpoint; // Assuming the client sends { endpoint: 'incrementLike', ... }


    // --- SECURITY CHECK: CLOUDFLARE TURNSTILE ---
    if (!payload.turnstile_token || !await verifyTurnstile(payload.turnstile_token)) {
        return jsonResponse({ error: "Verification failed. Are you a bot?" }, 403);
    }
    
    // ----------------------------------------------------
    // 2. /incrementLike (POST) - Write Endpoint
    // ----------------------------------------------------
    if (postAction === 'incrementLike') {
        const { post_name } = payload;
        if (!post_name) return jsonResponse({ error: 'Missing post_name' }, 400);

        // Call the RPC to atomically insert detail row and update aggregate count
        const { data: new_id, error } = await supabaseAdmin.rpc('handle_like_update', {
            p_post_name: post_name,
            p_action: 'increment'
        });

        if (error) {
            console.error("Increment RPC Error:", error);
            return jsonResponse({ error: 'Failed to increment like' }, 500);
        }

        // Return the new ID created by the database function for client-side storage
        return jsonResponse({ id: new_id });
    }

    // ----------------------------------------------------
    // 3. /decrementLike (POST) - Write Endpoint
    // ----------------------------------------------------
    if (postAction === 'decrementLike') {
        const { id, post_name } = payload;
        // Require both the ID from localStorage AND the post_name
        if (!id || !post_name) return jsonResponse({ error: 'Missing id or post_name' }, 400);

        // Call the RPC to atomically delete detail row and update aggregate count
        const { data: success_id, error } = await supabaseAdmin.rpc('handle_like_update', {
            p_post_name: post_name,
            p_action: 'decrement',
            p_like_id: id
        });

        if (error) {
            console.error("Decrement RPC Error:", error);
            return jsonResponse({ error: 'Failed to decrement like' }, 500);
        }

        // The RPC returns the ID if deletion was successful, or 0/null otherwise.
        if (!success_id) {
            return jsonResponse({ error: 'Like ID not found or already removed' }, 404);
        }

        return jsonResponse({ message: 'Like successfully decremented' });
    }

    return jsonResponse({ error: 'Not Found' }, 404);
});