'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.error('Auth error:', error, errorDescription);
        router.push(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (code) {
        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('Code exchange error:', exchangeError);
          router.push(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`);
          return;
        }
      }

      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push(redirectTo);
      } else {
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
      }
    };

    handleCallback();
  }, [code, error, errorDescription, redirectTo, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:py-20 px-4">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </main>
  );
}