import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const isPlaceholder = (v: string | undefined) =>
  !v || v.includes('placeholder') || v.includes('your-project');

let _browserClient: SupabaseClient | null = null;

function createMockClient(): SupabaseClient {
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

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => chain,
    rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    storage: { from: () => ({ upload: () => ({}), download: () => ({}), remove: () => ({}), list: () => ({}), getPublicUrl: () => ({}) }) },
  } as unknown as SupabaseClient;
}

export function getBrowserClient(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isPlaceholder(url) || isPlaceholder(key)) {
    _browserClient = createMockClient();
  } else {
    _browserClient = createBrowserClient(url!, key!);
  }
  return _browserClient;
}

// Legacy export for backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getBrowserClient()[prop as keyof SupabaseClient];
  },
});

// Server-side client (for API routes) — uses service role key
// This is a separate async function that avoids importing next/headers at module level
export async function createServerClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isPlaceholder(url) || isPlaceholder(anonKey)) {
    return getBrowserClient();
  }

  // Dynamic import to avoid Pages Router issues
  const { createServerClient: createSupabaseServerClient } = await import('@supabase/ssr');
  const { cookies } = await import('next/headers');

  const cookieStore = await cookies();
  return createSupabaseServerClient(url!, serviceKey || anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server component context - ignore
        }
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Synchronous version for non-async contexts (uses anon key, no cookie handling)
export function createServerClientSync(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (isPlaceholder(url) || isPlaceholder(anonKey)) {
    return getBrowserClient();
  }

  return createBrowserClient(url!, serviceKey || anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}