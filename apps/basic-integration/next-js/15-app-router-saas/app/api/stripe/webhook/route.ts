import Stripe from 'stripe';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { after, NextRequest, NextResponse } from 'next/server';
import { posthogIntegrationLogger, posthogLogsProvider } from '@/instrumentation';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';

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
    posthogIntegrationLogger?.emit({
      body: 'Stripe webhook signature verification failed',
      severityNumber: SeverityNumber.ERROR,
      attributes: { route: '/api/stripe/webhook' }
    });
    after(async () => {
      await posthogLogsProvider?.forceFlush();
    });
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
      posthogIntegrationLogger?.emit({
        body: 'Stripe subscription webhook processed',
        severityNumber: SeverityNumber.INFO,
        attributes: {
          route: '/api/stripe/webhook',
          webhook_type: event.type
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  after(async () => {
    await posthogLogsProvider?.forceFlush();
  });
  return NextResponse.json({ received: true });
}
