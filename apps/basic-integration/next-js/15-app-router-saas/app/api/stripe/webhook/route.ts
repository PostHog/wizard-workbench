import { SeverityNumber } from '@opentelemetry/api-logs';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { posthogLogProvider, posthogWebhookLogger } from '@/instrumentation';
import { after, NextRequest, NextResponse } from 'next/server';

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

  posthogWebhookLogger?.emit({
    body: 'Stripe webhook verified',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: 'stripe_webhook_verified',
      stripe_event_type: event.type,
    },
  });

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      posthogWebhookLogger?.emit({
        body: 'Stripe subscription webhook processed',
        severityNumber: SeverityNumber.INFO,
        attributes: {
          event: 'stripe_subscription_webhook_processed',
          stripe_event_type: event.type,
          subscription_status: subscription.status,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      posthogWebhookLogger?.emit({
        body: 'Stripe webhook event ignored',
        severityNumber: SeverityNumber.WARN,
        attributes: {
          event: 'stripe_webhook_ignored',
          stripe_event_type: event.type,
        },
      });
  }

  const logProvider = posthogLogProvider;
  if (logProvider) {
    after(async () => {
      await logProvider.forceFlush();
    });
  }

  return NextResponse.json({ received: true });
}
