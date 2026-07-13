import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import {
  captureServerEvent,
  captureServerException
} from '@/lib/posthog-server';

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
    await captureServerException(err, 'stripe-webhook', {
      endpoint: '/api/stripe/webhook'
    });
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
        await captureServerEvent({
          distinctId: `stripe_customer:${String(subscription.customer)}`,
          event: 'subscription_status_changed',
          properties: {
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            stripe_event_type: event.type,
            billing_provider: 'stripe'
          }
        });
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    await captureServerException(error, 'stripe-webhook', {
      endpoint: '/api/stripe/webhook',
      stripe_event_type: event.type
    });
    throw error;
  }
}
