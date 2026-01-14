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
    case 'customer.subscription.created':
      const createdSubscription = event.data.object as Stripe.Subscription;
      const createdCustomerId = typeof createdSubscription.customer === 'string'
        ? createdSubscription.customer
        : createdSubscription.customer.id;

      posthog.capture({
        distinctId: createdCustomerId,
        event: 'subscription_created',
        properties: {
          subscription_id: createdSubscription.id,
          status: createdSubscription.status,
          customer_id: createdCustomerId,
        },
      });
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      const updatedCustomerId = typeof updatedSubscription.customer === 'string'
        ? updatedSubscription.customer
        : updatedSubscription.customer.id;

      posthog.capture({
        distinctId: updatedCustomerId,
        event: 'subscription_updated',
        properties: {
          subscription_id: updatedSubscription.id,
          status: updatedSubscription.status,
          customer_id: updatedCustomerId,
        },
      });

      await handleSubscriptionChange(updatedSubscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      const deletedCustomerId = typeof deletedSubscription.customer === 'string'
        ? deletedSubscription.customer
        : deletedSubscription.customer.id;

      posthog.capture({
        distinctId: deletedCustomerId,
        event: 'subscription_canceled',
        properties: {
          subscription_id: deletedSubscription.id,
          status: deletedSubscription.status,
          customer_id: deletedCustomerId,
        },
      });

      await handleSubscriptionChange(deletedSubscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
