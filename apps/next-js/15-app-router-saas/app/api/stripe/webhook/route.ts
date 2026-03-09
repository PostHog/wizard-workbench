import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { teams, teamMembers } from '@/lib/db/schema';

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

      const team = await db
        .select({ id: teams.id, members: teamMembers.userId })
        .from(teams)
        .leftJoin(teamMembers, eq(teamMembers.teamId, teams.id))
        .where(eq(teams.stripeCustomerId, subscription.customer as string))
        .limit(1);

      const distinctId = team.length > 0 && team[0].members
        ? String(team[0].members)
        : (subscription.customer as string);

      const posthog = getPostHogClient();
      posthog.capture({
        distinctId,
        event: event.type === 'customer.subscription.deleted'
          ? 'subscription_cancelled'
          : 'subscription_updated',
        properties: {
          subscription_id: subscription.id,
          status: subscription.status,
          stripe_customer_id: subscription.customer as string,
          team_id: team.length > 0 ? team[0].id : null,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
