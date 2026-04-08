import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { teams, teamMembers, users } from '@/lib/db/schema';

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
        .select({ id: teams.id })
        .from(teams)
        .where(eq(teams.stripeSubscriptionId, subscription.id))
        .limit(1);

      if (team.length > 0) {
        const owner = await db
          .select({ email: users.email })
          .from(users)
          .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
          .where(eq(teamMembers.teamId, team[0].id))
          .limit(1);

        if (owner.length > 0) {
          const eventName =
            event.type === 'customer.subscription.deleted'
              ? 'subscription_cancelled'
              : 'subscription_updated';
          getPostHogClient().capture({
            distinctId: owner[0].email,
            event: eventName,
            properties: {
              subscription_id: subscription.id,
              status: subscription.status,
              team_id: team[0].id,
            },
          });
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
