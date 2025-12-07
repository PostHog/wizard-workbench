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
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);

      // PostHog: Track subscription events
      const customerId = subscription.customer as string;
      const team = await db
        .select()
        .from(teams)
        .where(eq(teams.stripeCustomerId, customerId))
        .limit(1);

      if (team.length > 0) {
        // Get the team owner's email for the distinct ID
        const teamOwner = await db
          .select({ user: users })
          .from(teamMembers)
          .innerJoin(users, eq(teamMembers.userId, users.id))
          .where(eq(teamMembers.teamId, team[0].id))
          .limit(1);

        if (teamOwner.length > 0) {
          const posthog = getPostHogClient();
          const eventName = event.type === 'customer.subscription.deleted'
            ? 'subscription_cancelled'
            : 'subscription_updated';

          posthog.capture({
            distinctId: teamOwner[0].user.email,
            event: eventName,
            properties: {
              team_id: team[0].id,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
              price_id: subscription.items.data[0]?.price?.id,
              cancel_at_period_end: subscription.cancel_at_period_end,
            }
          });
        }
      }
      break;
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // PostHog: Track checkout completed event
      if (session.customer) {
        const checkoutCustomerId = session.customer as string;
        const checkoutTeam = await db
          .select()
          .from(teams)
          .where(eq(teams.stripeCustomerId, checkoutCustomerId))
          .limit(1);

        if (checkoutTeam.length > 0) {
          const checkoutOwner = await db
            .select({ user: users })
            .from(teamMembers)
            .innerJoin(users, eq(teamMembers.userId, users.id))
            .where(eq(teamMembers.teamId, checkoutTeam[0].id))
            .limit(1);

          if (checkoutOwner.length > 0) {
            const posthog = getPostHogClient();
            posthog.capture({
              distinctId: checkoutOwner[0].user.email,
              event: 'checkout_completed',
              properties: {
                team_id: checkoutTeam[0].id,
                session_id: session.id,
                amount_total: session.amount_total,
                currency: session.currency,
              }
            });
          }
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
