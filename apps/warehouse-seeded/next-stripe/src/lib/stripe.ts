import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

/** The catalogue the storefront sells. Prices live in Stripe, not here. */
export const PRICE_IDS = {
  starter: 'price_placeholder_starter',
  team: 'price_placeholder_team',
} as const;

export type PlanId = keyof typeof PRICE_IDS;
