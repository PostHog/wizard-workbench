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
      const ownerRow = await db
        .select({ email: users.email })
        .from(users)
        .innerJoin(teamMembers, eq(teamMembers.userId, users.id))
        .innerJoin(teams, eq(teams.id, teamMembers.teamId))
        .where(eq(teams.stripeCustomerId, customerId))
        .limit(1);

      const distinctId = ownerRow[0]?.email ?? customerId;
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId,
        event: event.type === 'customer.subscription.deleted' ? 'subscription_cancelled' : 'subscription_updated',
        properties: {
          subscription_id: subscription.id,
          status: subscription.status,
          stripe_customer_id: customerId,
        },
      });
      await posthog.shutdown();
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
