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

    // PostHog: Capture webhook verification error
    const posthog = getPostHogClient();
    posthog.captureException(err as Error);

    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  const posthog = getPostHogClient();

  switch (event.type) {
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(updatedSubscription);

      // PostHog: Track subscription updated event
      posthog.capture({
        distinctId: updatedSubscription.customer as string,
        event: 'subscription_updated',
        properties: {
          stripe_subscription_id: updatedSubscription.id,
          subscription_status: updatedSubscription.status,
          stripe_customer_id: updatedSubscription.customer,
        },
      });
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(deletedSubscription);

      // PostHog: Track subscription cancelled event
      posthog.capture({
        distinctId: deletedSubscription.customer as string,
        event: 'subscription_cancelled',
        properties: {
          stripe_subscription_id: deletedSubscription.id,
          subscription_status: deletedSubscription.status,
          stripe_customer_id: deletedSubscription.customer,
        },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
