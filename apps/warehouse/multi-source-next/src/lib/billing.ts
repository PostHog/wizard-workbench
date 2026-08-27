import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

/** The plan a customer is on, used to sort the ticket queue by SLA. */
export async function planFor(customerId: string): Promise<string | null> {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });
  return subs.data[0]?.items.data[0]?.price.nickname ?? null;
}
