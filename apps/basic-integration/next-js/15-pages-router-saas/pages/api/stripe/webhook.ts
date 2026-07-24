import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { buffer } from 'micro';
import { getPostHogClient } from '@/lib/posthog-server';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';
import { teamMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';

// Disable body parsing, need raw body for Stripe webhook signature verification
export const config = {
  api: {
    bodyParser: false
  }
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_stub_secret';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
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
          .where(and(eq(teamMembers.teamId, team.id), eq(teamMembers.role, 'owner')))
          .limit(1);

        const distinctId = ownerMember[0]
          ? String(ownerMember[0].userId)
          : `stripe_customer_${customerId}`;

        const posthog = getPostHogClient();
        if (posthog) {
          posthog.capture({
            distinctId,
            event: 'subscription_changed',
            properties: {
              subscription_status: subscription.status,
              event_type: event.type,
              team_id: team.id,
            },
          });
          await posthog.flush();
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
