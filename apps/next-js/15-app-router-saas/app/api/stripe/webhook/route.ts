import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { db } from '@/lib/db/drizzle';
import { teams, teamMembers, users } from '@/lib/db/schema';
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

      const customerId = subscription.customer as string;
      const teamRow = await db
        .select({ teamId: teams.id })
        .from(teams)
        .where(eq(teams.stripeCustomerId, customerId))
        .limit(1);

      if (teamRow.length > 0) {
        const memberRow = await db
          .select({ email: users.email })
          .from(users)
          .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
          .where(eq(teamMembers.teamId, teamRow[0].teamId))
          .limit(1);

        if (memberRow.length > 0) {
          const posthog = getPostHogClient();
          const eventName = event.type === 'customer.subscription.deleted' ? 'subscription_cancelled' : 'subscription_updated';
          posthog.capture({
            distinctId: memberRow[0].email,
            event: eventName,
            properties: {
              team_id: teamRow[0].teamId,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
            },
          });
          await posthog.shutdown();
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
