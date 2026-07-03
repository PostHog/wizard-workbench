import type { NextApiRequest, NextApiResponse } from 'next';
import { PostHog } from 'posthog-node';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { buffer } from 'micro';

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

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0
      });
      await handleSubscriptionChange(subscription);
      await posthogClient.capture({
        distinctId: String(subscription.customer),
        event: 'server_subscription_updated',
        properties: {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          event_type: event.type
        }
      });
      await posthogClient.shutdown();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
