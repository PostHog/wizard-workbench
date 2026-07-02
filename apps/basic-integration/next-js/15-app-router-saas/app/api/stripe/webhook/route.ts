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

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      const posthog = getPostHogClient();
      const customerId = subscription.customer as string;
      const status = subscription.status;
      const plan = subscription.items.data[0]?.plan;

      if (status === 'active' || status === 'trialing') {
        posthog.capture({
          distinctId: customerId,
          event: 'subscription_updated',
          properties: {
            subscription_id: subscription.id,
            subscription_status: status,
            plan_name: typeof plan?.product === 'object' ? (plan.product as Stripe.Product).name : undefined,
            product_id: typeof plan?.product === 'string' ? plan.product : (plan?.product as Stripe.Product)?.id,
            stripe_customer_id: customerId,
          },
        });
      } else if (status === 'canceled' || status === 'unpaid') {
        posthog.capture({
          distinctId: customerId,
          event: 'subscription_canceled',
          properties: {
            subscription_id: subscription.id,
            subscription_status: status,
            stripe_customer_id: customerId,
          },
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
