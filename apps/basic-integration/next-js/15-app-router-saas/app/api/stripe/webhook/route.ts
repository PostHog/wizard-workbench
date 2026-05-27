import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { teamMembers, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const ownerRow = await db
          .select({ userId: teamMembers.userId, email: users.email })
          .from(teamMembers)
          .leftJoin(users, eq(users.id, teamMembers.userId))
          .where(
            and(eq(teamMembers.teamId, team.id), eq(teamMembers.role, 'owner'))
          )
          .limit(1);

        const distinctId =
          ownerRow[0]?.userId ? String(ownerRow[0].userId) : `team_${team.id}`;

        const posthog = getPostHogClient();
        posthog.capture({
          distinctId,
          event:
            event.type === 'customer.subscription.deleted'
              ? 'subscription_cancelled'
              : 'subscription_updated',
          properties: {
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            customer_id: customerId,
            team_id: team.id,
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
