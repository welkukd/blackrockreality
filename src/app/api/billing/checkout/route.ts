import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createStripeClient, getPriceId, SubscriptionPlan } from '@/lib/stripe';

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
    const supabase = await createServerClient();
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
    const userId = keyData.user_id;

    // Parse request body
    const body = await request.json();
    const { plan, interval, successUrl, cancelUrl } = body;

    if (!plan || !['starter', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be starter, pro, or enterprise' },
        { status: 400 }
      );
    }

    if (!interval || !['month', 'year'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid interval. Must be month or year' },
        { status: 400 }
      );
    }

    const priceId = getPriceId(plan as SubscriptionPlan, interval as 'month' | 'year');
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${plan} (${interval})` },
        { status: 500 }
      );
    }

    // Get workspace to check for existing Stripe customer
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id, name, stripe_customer_id, subscription_plan')
      .eq('id', workspaceId)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Initialize Stripe
    const stripe = createStripeClient();

    // Create or retrieve Stripe customer
    let customerId = workspace.stripe_customer_id;
    
    if (!customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      const customer = await stripe.customers.create({
        email: profile?.email,
        name: profile?.full_name || workspace.name,
        metadata: {
          workspace_id: workspaceId,
          user_id: userId,
        },
      });

      customerId = customer.id;

      // Save customer ID to workspace
      await supabase
        .from('workspaces')
        .update({ stripe_customer_id: customerId })
        .eq('id', workspaceId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard/settings?tab=billing&success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/dashboard/settings?tab=billing&canceled=true`,
      metadata: {
        workspace_id: workspaceId,
        plan,
        interval,
      },
      subscription_data: {
        metadata: {
          workspace_id: workspaceId,
          plan,
          interval,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}