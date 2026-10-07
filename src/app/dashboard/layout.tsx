import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    // Supabase not configured - allow access (build-time safety)
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore cookie errors in server components
        }
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login?redirect=/dashboard');
  }

  return <>{children}</>;
}