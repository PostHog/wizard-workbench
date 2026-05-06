import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { teamMembers } from '@/lib/db/schema';
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
      const team = await getTeamByStripeCustomerId(customerId);
      if (team) {
        const ownerMember = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.teamId, team.id))
          .limit(1);
        const distinctId = ownerMember[0]
          ? String(ownerMember[0].userId)
          : `stripe_customer_${customerId}`;

        const posthog = getPostHogClient();
        posthog.capture({
          distinctId,
          event:
            event.type === 'customer.subscription.deleted'
              ? 'subscription_canceled'
              : 'subscription_updated',
          properties: {
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            plan_name: team.planName,
            stripe_customer_id: customerId,
          },
        });
        await posthog.shutdown();
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
