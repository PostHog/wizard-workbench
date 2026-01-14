// QUACK QUACK IM A BIG FLUFFY DOG
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';

// Use a dummy webhook secret for stub mode
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);

    // PostHog error tracking for webhook verification failure
    const posthog = getPostHogClient();
    posthog.captureException(err as Error, 'stripe_webhook', {
      context: 'webhook_verification'
    });

    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  const posthog = getPostHogClient();

  switch (event.type) {
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(updatedSubscription);

      // PostHog tracking for subscription update
      posthog.capture({
        distinctId: updatedSubscription.customer as string,
        event: 'subscription_updated',
        properties: {
          subscription_id: updatedSubscription.id,
          subscription_status: updatedSubscription.status,
          customer_id: updatedSubscription.customer,
          source: 'stripe_webhook'
        }
      });
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(deletedSubscription);

      // PostHog tracking for subscription cancellation
      posthog.capture({
        distinctId: deletedSubscription.customer as string,
        event: 'subscription_canceled',
        properties: {
          subscription_id: deletedSubscription.id,
          subscription_status: deletedSubscription.status,
          customer_id: deletedSubscription.customer,
          source: 'stripe_webhook'
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
