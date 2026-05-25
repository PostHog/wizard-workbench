import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { buffer } from 'micro';
import { PostHog } from 'posthog-node';

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

  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  switch (event.type) {
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      posthog.capture({
        distinctId: subscription.customer as string,
        event: 'subscription_updated',
        properties: {
          subscription_id: subscription.id,
          status: subscription.status,
          plan_id: subscription.items.data[0]?.price.id,
        },
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      posthog.capture({
        distinctId: subscription.customer as string,
        event: 'subscription_cancelled',
        properties: {
          subscription_id: subscription.id,
          plan_id: subscription.items.data[0]?.price.id,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  await posthog.shutdown();

  return res.status(200).json({ received: true });
}
