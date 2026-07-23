import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { teamMembers } from '@/lib/db/schema';
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
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      const customerId = subscription.customer as string;
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const ownerRow = await db
          .select({ userId: teamMembers.userId })
          .from(teamMembers)
          .where(
            and(
              eq(teamMembers.teamId, team.id),
              eq(teamMembers.role, 'owner')
            )
          )
          .limit(1);

        if (ownerRow.length > 0) {
          const posthog = getPostHogClient();
          if (posthog) {
            posthog.capture({
              distinctId: String(ownerRow[0].userId),
              event: 'subscription_changed',
              properties: {
                team_id: team.id,
                subscription_status: subscription.status,
                event_type: event.type,
              },
            });
            await posthog.flush();
          }
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
