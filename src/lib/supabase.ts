import { createBrowserClient } from '@supabase/ssr';

let _supabase: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    if (!_supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
        // Return mock client for build-time safety
        return {
          auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          },
          from: () => ({
            select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            upsert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            eq: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            neq: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            gt: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            gte: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            lt: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            lte: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            like: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            ilike: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            in: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            order: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            limit: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            single: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            maybeSingle: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            range: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          }),
          rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          storage: { from: () => ({ upload: () => ({}), download: () => ({}), remove: () => ({}), list: () => ({}), getPublicUrl: () => ({}) }) },
        } as any;
      }

      _supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return (_supabase as any)[prop];
  },
});

// Server-side client (for API routes)
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return supabase; // Return mock
  }

  return createBrowserClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}