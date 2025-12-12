import { supabase } from './supabaseClient';

/**
 * Create profile for the currently authenticated user.
 * Assumes signUp returns a session (or user is signed in).
 */
export async function createProfileForCurrentUser(name) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) return { profile: null, error: userError };

    const user = userData?.user ?? null;
    if (!user || !user.id) return { profile: null, error: new Error("No authenticated user!")};

    const payload = { auth_id: user.id, email: user.email, name };

    const { data, error } = await supabase
        .from('users')
        .insert([payload])
        .select()
        .single()

    if (error) return { profile: null, error };
    return { profile: data, error: null };
}

/**
 * Fetch current user's profile
 */
export async function getCurrentUserProfile() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user ?? null;
    if (!user) return { profile: null, error: new Error('No authenticated user') };

    const { data, error } = await supabase
        .from('users')
        .select('id, auth_id, email, name, created_at')
        .eq('auth_id', user.id)
        .single();

    if (error) return { profile: null, error };
    return { profile: data, error: null };
}
