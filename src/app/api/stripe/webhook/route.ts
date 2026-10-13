import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createStripeClient, getPlanByPriceId, isSubscriptionActive } from '@/lib/stripe';
import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const stripe = createStripeClient();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabase, subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string; customer?: string };
        await handleInvoicePaymentSucceeded(supabase, invoice, stripe);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string; customer?: string; last_payment_error?: { message?: string } };
        await handleInvoicePaymentFailed(supabase, invoice, stripe);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  const workspaceId = session.metadata?.workspace_id;
  const plan = session.metadata?.plan;
  const interval = session.metadata?.interval;

  if (!workspaceId || !plan) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  const priceId = session.line_items?.data[0]?.price?.id;
  if (!priceId) {
    console.error('No price ID in checkout session:', session.id);
    return;
  }

  // Update workspace with subscription info
  const { error: wsError } = await supabase
    .from('workspaces')
    .update({
      stripe_customer_id: session.customer as string,
      subscription_plan: plan,
      subscription_status: 'active',
      subscription_interval: interval,
      stripe_subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq('id', workspaceId);

  if (wsError) {
    console.error('Failed to update workspace after checkout:', wsError);
    return;
  }

  // Create payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      workspace_id: workspaceId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      stripe_price_id: priceId,
      amount: session.amount_total || 0,
      currency: session.currency || 'usd',
      status: 'paid',
      plan,
      interval: interval || 'month',
      metadata: {
        checkout_session_id: session.id,
      },
    });

  if (paymentError) {
    console.error('Failed to record payment:', paymentError);
  }

  console.log(`Checkout completed for workspace ${workspaceId}, plan ${plan} (${interval})`);
}

async function handleSubscriptionChange(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription
) {
  const workspaceId = subscription.metadata?.workspace_id;
  const priceId = subscription.items.data[0]?.price.id;

  if (!workspaceId) {
    console.error('Missing workspace_id in subscription metadata:', subscription.id);
    return;
  }

  const plan = getPlanByPriceId(priceId) || subscription.metadata?.plan;
  const status = subscription.status;
  const isActive = isSubscriptionActive(status as Parameters<typeof isSubscriptionActive>[0]);

  const updateData: Record<string, unknown> = {
    subscription_status: status,
    updated_at: new Date().toISOString(),
  };

  if (plan) {
    updateData.subscription_plan = plan;
  }

  if (subscription.id) {
    updateData.stripe_subscription_id = subscription.id;
  }

  if (isActive) {
    const interval = subscription.items.data[0]?.price.recurring?.interval;
    if (interval) {
      updateData.subscription_interval = interval;
    }
  }

  const { error } = await supabase
    .from('workspaces')
    .update(updateData)
    .eq('id', workspaceId);

  if (error) {
    console.error('Failed to update workspace subscription:', error);
  } else {
    console.log(`Subscription ${subscription.id} updated for workspace ${workspaceId}: ${status}`);
  }
}

async function handleInvoicePaymentSucceeded(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice & { subscription?: string; customer?: string },
  stripe: Stripe
) {
  if (!invoice.subscription || !invoice.customer) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const workspaceId = subscription.metadata?.workspace_id;

  if (!workspaceId) return;

  const { error } = await supabase
    .from('payments')
    .insert({
      workspace_id: workspaceId,
      stripe_customer_id: invoice.customer as string,
      stripe_subscription_id: invoice.subscription as string,
      stripe_price_id: subscription.items.data[0]?.price.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'paid',
      plan: subscription.metadata?.plan,
      interval: subscription.metadata?.interval,
      metadata: {
        invoice_number: invoice.number,
      },
    });

  if (error) {
    console.error('Failed to record successful payment:', error);
  }
}

async function handleInvoicePaymentFailed(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice & { subscription?: string; customer?: string; last_payment_error?: { message?: string } },
  stripe: Stripe
) {
  if (!invoice.subscription || !invoice.customer) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const workspaceId = subscription.metadata?.workspace_id;

  if (!workspaceId) return;

  // Update subscription status to past_due
  const { error } = await supabase
    .from('workspaces')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('id', workspaceId);

  if (error) {
    console.error('Failed to update workspace for failed payment:', error);
  }

  // Record failed payment
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      workspace_id: workspaceId,
      stripe_customer_id: invoice.customer as string,
      stripe_subscription_id: invoice.subscription as string,
      stripe_price_id: subscription.items.data[0]?.price.id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      plan: subscription.metadata?.plan,
      interval: subscription.metadata?.interval,
      metadata: {
        invoice_number: invoice.number,
        failure_reason: invoice.last_payment_error?.message,
      },
    });

  if (paymentError) {
    console.error('Failed to record failed payment:', paymentError);
  }

  console.log(`Payment failed for workspace ${workspaceId}, invoice ${invoice.id}`);
}