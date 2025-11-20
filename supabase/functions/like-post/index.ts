// Deno imports
import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
// Supabase Client import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// The Deno runtime provides the FormData class globally
// const FormData = globalThis.FormData; 

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
    headers: { 'Content-Type': 'application/json' } 
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
        console.error("CAPTCHA_SECRET_KEY not set!");
        return false; // Fail safe if secret is missing
    }
    
    // Cloudflare requires the payload to be sent as 'multipart/form-data'
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
    const endpoint = url.pathname.split('/v1/')[1];

    // ----------------------------------------------------
    // 1. /numLikes (GET) - Public Read Endpoint
    // ----------------------------------------------------
    if (endpoint === 'numLikes' && req.method === 'GET') {
        const postName = url.searchParams.get('post_name');
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

    // --- SECURITY CHECK: CLOUDFLARE TURNSTILE ---
    if (!payload.turnstile_token || !await verifyTurnstile(payload.turnstile_token)) {
        return jsonResponse({ error: "Verification failed. Are you a bot?" }, 403);
    }
    
    // ----------------------------------------------------
    // 2. /incrementLike (POST) - Write Endpoint
    // ----------------------------------------------------
    if (endpoint === 'incrementLike') {
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
    if (endpoint === 'decrementLike') {
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