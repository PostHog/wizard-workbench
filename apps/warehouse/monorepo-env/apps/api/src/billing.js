/**
 * Billing is called over plain HTTP rather than through the Stripe SDK, so
 * `package.json` carries no `stripe` dependency. `STRIPE_SECRET_KEY` in
 * `apps/api/.env` is the only signal that this workspace bills through Stripe.
 */
const STRIPE_API = 'https://api.stripe.com/v1';

async function stripeGet(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${STRIPE_API}/${path}?${query}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Stripe-Version': '2024-09-30.acacia',
    },
  });
  if (!response.ok) {
    throw new Error(`stripe ${path} failed: ${response.status}`);
  }
  return response.json();
}

export function activeSubscriptions(customerId) {
  return stripeGet('subscriptions', { customer: customerId, status: 'active' });
}

export function invoices(customerId, limit = 20) {
  return stripeGet('invoices', { customer: customerId, limit });
}
