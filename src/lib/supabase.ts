import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

const createMockClient = (): SupabaseClient => ({
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => {
    const chain = {
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      delete: () => chain,
      upsert: () => chain,
      eq: () => chain,
      neq: () => chain,
      gt: () => chain,
      gte: () => chain,
      lt: () => chain,
      lte: () => chain,
      like: () => chain,
      ilike: () => chain,
      in: () => chain,
      order: () => chain,
      limit: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      maybeSingle: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      range: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    };
    return chain;
  },
  rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  storage: { from: () => ({ upload: () => ({}), download: () => ({}), remove: () => ({}), list: () => ({}), getPublicUrl: () => ({}) }) },
}) as unknown as SupabaseClient;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
        _supabase = createMockClient();
      } else {
        _supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      }
    }
    return _supabase[prop as keyof SupabaseClient];
  },
});

// Server-side client (for API routes)
export function createServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return supabase;
  }

  return createBrowserClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}