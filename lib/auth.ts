import { supabase } from './supabase';

export async function getSupabaseUser() {
  if (!supabase) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Failed to fetch user session:', err);
    return null;
  }
}

export async function signOutUser() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}
