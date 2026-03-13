import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { db } from '@/lib/db/drizzle';
import { teams, teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
        .select()
        .from(teams)
        .where(eq(teams.stripeSubscriptionId, subscription.id))
        .limit(1);

      if (team.length > 0) {
        const teamMember = await db
          .select({ userId: teamMembers.userId })
          .from(teamMembers)
          .where(eq(teamMembers.teamId, team[0].id))
          .limit(1);

        const distinctId = teamMember.length > 0 ? String(teamMember[0].userId) : `team-${team[0].id}`;
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId,
          event: event.type === 'customer.subscription.deleted' ? 'subscription_cancelled' : 'subscription_updated',
          properties: {
            team_id: team[0].id,
            plan_name: team[0].planName,
            subscription_status: subscription.status,
            stripe_subscription_id: subscription.id,
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
