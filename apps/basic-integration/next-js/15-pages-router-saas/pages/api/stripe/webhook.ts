import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { buffer } from 'micro';
import { flushPostHogServerClient, getPostHogServerClient } from '@/lib/posthog-server';

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
    const posthog = getPostHogServerClient();
    posthog.captureException(err, 'stripe-webhook-signature');
    await flushPostHogServerClient();
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      const posthog = getPostHogServerClient();
      posthog.capture({
        distinctId: subscription.customer?.toString() || 'stripe-webhook',
        event: 'stripe_subscription_updated',
        properties: {
          stripe_event_type: event.type,
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id
        }
      });
      await flushPostHogServerClient();
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
