import Stripe from 'stripe';

/**
 * One shared Stripe client. `apiVersion` is pinned so a Stripe-side default
 * bump cannot change the shape of the objects this service stores.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia',
});

/** Price ids for the two plans this service sells. */
export const PLANS = {
  starter: 'price_starter_placeholder',
  scale: 'price_scale_placeholder',
};
