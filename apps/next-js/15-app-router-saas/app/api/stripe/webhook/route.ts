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
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      // Capture subscription updated event in PostHog
      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: customerId,
          event: 'subscription_updated',
          properties: {
            subscription_id: subscription.id,
            status: subscription.status,
            team_id: team.id
          }
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      // Capture subscription cancelled event in PostHog before handling the change
      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: customerId,
          event: 'subscription_cancelled',
          properties: {
            subscription_id: subscription.id,
            team_id: team.id
          }
        });
      }

      await handleSubscriptionChange(subscription);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
