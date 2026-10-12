import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createStripeClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Validate Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.slice(7);
    
    // Validate API key and get workspace
    const supabase = createServerClient();
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, workspace_id, user_id')
      .eq('key_prefix', apiKey.slice(0, 8))
      .single();

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const workspaceId = keyData.workspace_id;

    // Get workspace to check for Stripe customer
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id, name, stripe_customer_id')
      .eq('id', workspaceId)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    if (!workspace.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 }
      );
    }

    // Initialize Stripe
    const stripe = createStripeClient();

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: workspace.stripe_customer_id,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard/settings?tab=billing`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create portal session' },
      { status: 500 }
    );
  }
}