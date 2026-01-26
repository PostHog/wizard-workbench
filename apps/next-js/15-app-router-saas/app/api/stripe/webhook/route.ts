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

    // Capture webhook error
    const posthog = getPostHogClient();
    posthog.captureException(err);
    await posthog.shutdown();

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

      // Capture subscription updated event
      posthog.capture({
        distinctId: updatedSubscription.customer as string,
        event: 'subscription_updated',
        properties: {
          subscription_id: updatedSubscription.id,
          status: updatedSubscription.status,
          customer_id: updatedSubscription.customer,
        },
      });
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(deletedSubscription);

      // Capture subscription canceled event
      posthog.capture({
        distinctId: deletedSubscription.customer as string,
        event: 'subscription_canceled',
        properties: {
          subscription_id: deletedSubscription.id,
          customer_id: deletedSubscription.customer,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  await posthog.shutdown();
  return NextResponse.json({ received: true });
}
