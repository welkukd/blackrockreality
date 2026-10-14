import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const PRICE_IDS = {
  starter_monthly: process.env.STRIPE_PRICE_ID_STARTER_MONTHLY || '',
  starter_yearly: process.env.STRIPE_PRICE_ID_STARTER_YEARLY || '',
  pro_monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
  pro_yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || '',
  enterprise_monthly: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY || '',
  enterprise_yearly: process.env.STRIPE_PRICE_ID_ENTERPRISE_YEARLY || '',
};

export async function GET(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  // Check if any price IDs are actually configured
  const hasAnyPriceId = Object.values(PRICE_IDS).some(id => id && id.length > 0);
  if (!hasAnyPriceId) {
    return NextResponse.json({ 
      data: [], 
      message: 'No Stripe price IDs configured. Set STRIPE_PRICE_ID_* env vars in Vercel.' 
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-09-30.endive',
    typescript: true,
  });

  try {
    const prices = await Promise.all(
      Object.entries(PRICE_IDS).map(async ([key, priceId]) => {
        if (!priceId) return { key, error: 'Price ID not configured' };
        try {
          const price = await stripe.prices.retrieve(priceId);
          return {
            key,
            id: price.id,
            amount: price.unit_amount,
            currency: price.currency,
            interval: price.recurring?.interval,
            product: price.product,
          };
        } catch (err) {
          return { key, error: err instanceof Error ? err.message : 'Failed to fetch price' };
        }
      })
    );

    return NextResponse.json({ data: prices });
  } catch (error) {
    console.error('Stripe prices error:', error);
    const err = error as { message?: string };
    if (err.message?.includes('Invalid API Key')) {
      return NextResponse.json({ 
        error: 'Stripe key mismatch: test key with live prices or vice versa. Ensure STRIPE_SECRET_KEY mode matches price ID mode.' 
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}