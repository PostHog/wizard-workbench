import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse, after } from 'next/server';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '@/instrumentation';

// Use a dummy webhook secret for stub mode
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';
const posthogLogger = loggerProvider?.getLogger('posthog.stripe_webhook');

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    posthogLogger?.emit({
      body: 'stripe webhook rejected',
      severityNumber: SeverityNumber.ERROR,
      attributes: {
        operation: 'stripe_webhook',
        outcome: 'invalid_signature',
      },
    });
    after(async () => {
      await loggerProvider?.forceFlush();
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
      posthogLogger?.emit({
        body: 'stripe subscription webhook processed',
        severityNumber: SeverityNumber.INFO,
        attributes: {
          operation: 'stripe_webhook',
          outcome: 'subscription_processed',
        },
      });
      after(async () => {
        await loggerProvider?.forceFlush();
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
