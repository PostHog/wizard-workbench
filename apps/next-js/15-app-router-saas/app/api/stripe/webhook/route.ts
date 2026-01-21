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

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      // PostHog: Track subscription updated event (server-side)
      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: team.id.toString(),
          event: 'subscription_updated',
          properties: {
            team_id: team.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            event_type: event.type,
          },
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
