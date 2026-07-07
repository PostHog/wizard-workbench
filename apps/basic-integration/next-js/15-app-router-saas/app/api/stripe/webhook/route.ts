import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';
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
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      const team = await getTeamByStripeCustomerId(subscription.customer as string);
      if (team) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: `team_${team.id}`,
          event: 'subscription_updated',
          properties: {
            team_id: team.id,
            status: subscription.status,
            subscription_id: subscription.id,
          },
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      const team = await getTeamByStripeCustomerId(subscription.customer as string);
      if (team) {
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: `team_${team.id}`,
          event: 'subscription_cancelled',
          properties: {
            team_id: team.id,
            subscription_id: subscription.id,
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
