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

      // Track subscription update server-side
      posthog.capture({
        distinctId: updatedSubscription.customer as string,
        event: 'subscription_updated',
        properties: {
          subscription_status: updatedSubscription.status,
          stripe_subscription_id: updatedSubscription.id,
          stripe_customer_id: updatedSubscription.customer as string,
        },
      });
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(deletedSubscription);

      // Track subscription cancellation server-side
      posthog.capture({
        distinctId: deletedSubscription.customer as string,
        event: 'subscription_canceled',
        properties: {
          subscription_status: deletedSubscription.status,
          stripe_subscription_id: deletedSubscription.id,
          stripe_customer_id: deletedSubscription.customer as string,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  await posthog.shutdown();
  return NextResponse.json({ received: true });
}
