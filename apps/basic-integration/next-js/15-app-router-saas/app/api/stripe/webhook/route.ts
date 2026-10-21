import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { after, NextRequest, NextResponse } from 'next/server';
import {
  flushPostHogLogs,
  logPostHogInfo,
  logPostHogWarn
} from '@/lib/posthog-logs';

// Use a dummy webhook secret for stub mode
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';

export async function POST(request: NextRequest) {
  after(flushPostHogLogs);

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    logPostHogWarn('stripe_webhook_signature_invalid', {
      route: '/api/stripe/webhook'
    });
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      logPostHogInfo('stripe_subscription_webhook_processed', {
        route: '/api/stripe/webhook',
        event_type: event.type
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
