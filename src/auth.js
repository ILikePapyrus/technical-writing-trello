import { supabase } from './supabaseClient';

/**
 * Sign in with email + password
 * Returns { email, token } on success
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { email: data.user?.email ?? null, token: data.session?.access_token ?? null };
}

/**
 * Sign up with email + password
 * Assumes email confirmation is disabled and signUp returns a session.
 * Returns { user, session } or throws
 */
export async function signup({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: data.user ?? null, session: data.session ?? null };
}

/**
 * Logout current session
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user (async)
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user ?? null;
}

/**
 * Synchronous-ish check used by UI: checks localStorage token presence.
 */
export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem('supabase.auth.token'));
  } catch {
    return false;
  }
}

export default { login, signup, logout, getUser, isAuthenticated };
