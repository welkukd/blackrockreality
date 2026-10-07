import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection
    const { error } = await supabase.from('workspaces').select('id').limit(1);
    
    if (error && !error.message.includes('Supabase not configured')) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'disconnected', error: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}