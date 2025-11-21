import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { supabase } from '$lib/supabase'; // Adjust path to your Supabase client initialization

// --- Private Helper Function for POST/Write Operations ---

/**
 * A general function to call the 'like-post' Edge Function for write operations.
 * Handles the standard response wrapping and includes the required security token.
 * * @param {string} endpoint - The action to execute ('incrementLike' or 'decrementLike').
 * @param {object} payload - Data including post_name, id, and turnstile_token.
 */
async function invokeWriteApi(endpoint, payload) {
    try {
        const { data, error } = await supabase.functions.invoke('like-post', {
            method: 'POST', 
            body: { 
                ...payload,
                // The Edge Function uses this property to determine the write route
                endpoint: endpoint 
            }
        });

        if (error) {
            console.error(`Edge Function Write Error (${endpoint}):`, error.message);
            throw new Error(error.message);
        }
        return data;
    } catch (e) {
        console.error(`API Write Call Failed (${endpoint}):`, e);
        throw e;
    }
}

// --- Public Utility Functions ---

/**
 * 1. Fetches the number of likes for a specific blog post using a simple GET request.
 * (Bypasses Turnstile verification for read efficiency)
 * @param {string} postName - The unique name/slug of the blog post.
 * @returns {number} The total number of likes (or 0 on error/not found).
 */
export async function getLikes(postName) {
    // We use standard fetch for the dedicated, unauthenticated GET endpoint
    const apiBaseUrl = PUBLIC_SUPABASE_URL;
    
    // Note: The 'endpoint=numLikes' is passed as a query parameter in the URL
    const url = `${apiBaseUrl}/functions/v1/like-post?endpoint=numLikes&post_name=${postName}`;
    
    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            // Handle HTTP errors (e.g., 400 or 500) gracefully
            const errorBody = await response.json();
            throw new Error(errorBody.error || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // The backend returns { num_likes: X }
        return data?.num_likes ?? 0;
        
    } catch (e) {
        console.error("Failed to fetch like count:", e);
        return 0; 
    }
}


/**
 * 2. Increments the like count for a post and creates a detail record.
 * (Requires Turnstile token)
 * @param {string} postName - The unique name/slug of the blog post.
 * @param {string} turnstileToken - The Cloudflare Turnstile token from the client.
 * @returns {string} The new ID of the individual like record (to be stored in localStorage).
 */
export async function increaseLike(postName, turnstileToken) {
    const data = await invokeWriteApi('incrementLike', {
        post_name: postName,
        turnstile_token: turnstileToken
    });

    // The backend RPC returns { id: 501 }
    if (data && data.id) {
        return data.id.toString(); 
    }
    throw new Error("Failed to receive a valid like ID from the server.");
}


/**
 * 3. Decrements the like count and removes the detail record.
 * (Requires Turnstile token)
 * @param {string} postName - The unique name/slug of the blog post.
 * @param {string} likeId - The ID of the individual like record retrieved from localStorage.
 * @param {string} turnstileToken - The Cloudflare Turnstile token from the client.
 * @returns {boolean} True if the decrement was successful.
 */
export async function decreaseLike(postName, likeId, turnstileToken) {
    const data = await invokeWriteApi('decrementLike', {
        post_name: postName,
        id: likeId, // ID from localStorage
        turnstile_token: turnstileToken
    });

    // The backend returns { message: '...' } on success or throws an error on failure (404)
    return data && data.message ? true : false;
}