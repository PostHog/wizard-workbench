import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { buffer } from 'micro';
import { getPostHogClient } from '@/lib/posthog-server';

// Disable body parsing, need raw body for Stripe webhook signature verification
export const config = {
  api: {
    bodyParser: false
  }
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  const posthog = getPostHogClient();

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      // PostHog: Track subscription changes
      const distinctId = subscription.metadata?.user_id || subscription.customer as string;
      const eventName = event.type === 'customer.subscription.deleted'
        ? 'subscription_cancelled'
        : 'subscription_updated';

      posthog.capture({
        distinctId,
        event: eventName,
        properties: {
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          stripe_customer_id: subscription.customer,
          cancel_at_period_end: subscription.cancel_at_period_end,
          source: 'webhook'
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
