import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { db } from '@/lib/db/drizzle';
import { teamMembers, users } from '@/lib/db/schema';
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
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      
      // Find the user associated with this subscription
      const teamMember = await db
        .select({ userId: teamMembers.userId })
        .from(teamMembers)
        .leftJoin(users, eq(teamMembers.userId, users.id))
        .limit(1);
      
      if (teamMember?.userId) {
        // Capture subscription updated event
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: String(teamMember.userId),
          event: 'subscription_updated',
          properties: {
            subscriptionId: subscription.id,
            status: subscription.status,
            customerId: subscription.customer,
          },
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription);
      
      // Find the user associated with this subscription
      const teamMember = await db
        .select({ userId: teamMembers.userId })
        .from(teamMembers)
        .leftJoin(users, eq(teamMembers.userId, users.id))
        .limit(1);
      
      if (teamMember?.userId) {
        // Capture subscription cancelled event
        const posthog = getPostHogClient();
        posthog.capture({
          distinctId: String(teamMember.userId),
          event: 'subscription_cancelled',
          properties: {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
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
