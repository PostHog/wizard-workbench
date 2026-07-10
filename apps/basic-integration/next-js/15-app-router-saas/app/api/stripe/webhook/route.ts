import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createPostHogServerClient } from '@/lib/posthog-server';

// Use a dummy webhook secret for stub mode
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  const posthog = createPostHogServerClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    posthog.captureException(err, signature || 'missing-signature', {
      area: 'stripe_webhook_signature_verification'
    });
    await posthog.shutdown();
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    posthog.capture({
      distinctId: event.id,
      event: 'subscription_webhook_processed',
      properties: {
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        livemode: event.livemode
      }
    });

    await posthog.shutdown();
    return NextResponse.json({ received: true });
  } catch (error) {
    posthog.captureException(error, event.id, {
      area: 'stripe_webhook_handler',
      stripe_event_type: event.type
    });
    await posthog.shutdown();
    throw error;
  }
}
