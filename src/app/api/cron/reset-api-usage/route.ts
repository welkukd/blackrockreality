import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset daily API key usage
    const { error } = await supabase.rpc('reset_api_key_usage');
    
    if (error) {
      console.error('Failed to reset API key usage:', error);
      return NextResponse.json({ error: 'Failed to reset usage' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'API key usage reset completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}