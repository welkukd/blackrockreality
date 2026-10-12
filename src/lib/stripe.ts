import Stripe from 'stripe';

export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';

export interface PlanConfig {
  name: string;
  description: string;
  monthlyPrice: number; // in USD cents
  yearlyPrice: number;  // in USD cents (20% discount)
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  stripeProductId?: string;
  leadsPerMonth: number;
  apiKeysLimit: number;
  rateLimitPerDay: number;
  prioritySupport: boolean;
  whitelabelDashboard: boolean;
  advancedAnalytics: boolean;
  customIntegrations: boolean;
}

// Plan configurations - prices in USD cents
export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  starter: {
    name: 'Starter',
    description: 'Perfect for individual agents getting started',
    monthlyPrice: 9900,    // $99/mo
    yearlyPrice: 95040,    // $950.40/yr (20% off)
    features: [
      'Up to 1,000 leads/month',
      '5 API keys',
      '10,000 API requests/day',
      'Email support',
      'Basic lead grading',
      'Standard dashboard',
      'CSV export',
    ],
    leadsPerMonth: 1000,
    apiKeysLimit: 5,
    rateLimitPerDay: 10000,
    prioritySupport: false,
    whitelabelDashboard: false,
    advancedAnalytics: false,
    customIntegrations: false,
  },
  pro: {
    name: 'Pro',
    description: 'For growing teams needing more volume',
    monthlyPrice: 29900,   // $299/mo
    yearlyPrice: 287040,   // $2,870.40/yr (20% off)
    features: [
      'Up to 10,000 leads/month',
      '25 API keys',
      '100,000 API requests/day',
      'Priority email support',
      'Advanced lead grading & AI enrichment',
      'White-label dashboard',
      'Advanced analytics & reports',
      'Webhook notifications',
      'Team collaboration',
    ],
    leadsPerMonth: 10000,
    apiKeysLimit: 25,
    rateLimitPerDay: 100000,
    prioritySupport: true,
    whitelabelDashboard: true,
    advancedAnalytics: true,
    customIntegrations: false,
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large brokerages and enterprises',
    monthlyPrice: 99900,   // $999/mo
    yearlyPrice: 959040,   // $9,590.40/yr (20% off)
    features: [
      'Unlimited leads',
      'Unlimited API keys',
      'Unlimited API requests',
      '24/7 dedicated support',
      'Custom AI models & grading',
      'Full white-label + custom domain',
      'Advanced analytics + custom reports',
      'Custom integrations & webhooks',
      'SSO (SAML/OIDC)',
      'Dedicated infrastructure option',
      'SLA guarantee',
    ],
    leadsPerMonth: -1, // unlimited
    apiKeysLimit: -1,  // unlimited
    rateLimitPerDay: -1, // unlimited
    prioritySupport: true,
    whitelabelDashboard: true,
    advancedAnalytics: true,
    customIntegrations: true,
  },
};

// Create Stripe client (initialized inside route handlers for Vercel SDK guard pattern)
export function createStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2026-09-30.endive',
    typescript: true,
  });
}

// Get plan by price ID (for webhook handling)
export function getPlanByPriceId(priceId: string): SubscriptionPlan | null {
  for (const [planKey, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceIdMonthly === priceId || plan.stripePriceIdYearly === priceId) {
      return planKey as SubscriptionPlan;
    }
  }
  return null;
}

// Get price ID for a plan and interval
export function getPriceId(plan: SubscriptionPlan, interval: 'month' | 'year'): string | undefined {
  const planConfig = PLANS[plan];
  return interval === 'month' ? planConfig.stripePriceIdMonthly : planConfig.stripePriceIdYearly;
}

// Format price for display
export function formatPrice(cents: number, interval: 'month' | 'year' = 'month'): string {
  const dollars = cents / 100;
  if (interval === 'year') {
    return `$${dollars.toLocaleString()}/yr`;
  }
  return `$${dollars.toLocaleString()}/mo`;
}

// Calculate yearly savings
export function getYearlySavings(plan: SubscriptionPlan): { savings: number; percent: number } {
  const planConfig = PLANS[plan];
  const monthlyTotal = planConfig.monthlyPrice * 12;
  const savings = monthlyTotal - planConfig.yearlyPrice;
  const percent = Math.round((savings / monthlyTotal) * 100);
  return { savings: savings / 100, percent };
}

// Subscription status types
export type SubscriptionStatus = 
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

// Check if subscription is active
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return ['active', 'trialing'].includes(status);
}

// Check if subscription allows access
export function hasSubscriptionAccess(status: SubscriptionStatus): boolean {
  return ['active', 'trialing', 'past_due'].includes(status);
}