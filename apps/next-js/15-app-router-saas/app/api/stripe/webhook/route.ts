import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';

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
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      // Track subscription events
      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);

      if (team) {
        const eventName = subscription.status === 'canceled' || subscription.status === 'unpaid'
          ? 'subscription_canceled'
          : 'subscription_updated';

        posthog.capture({
          distinctId: customerId, // Use customer ID as distinct ID for webhook events
          event: eventName,
          properties: {
            team_id: team.id,
            subscription_id: subscription.id,
            customer_id: customerId,
            status: subscription.status,
            plan_id: subscription.items.data[0]?.plan?.id,
            source: 'webhook'
          }
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
