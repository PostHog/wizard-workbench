import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { and, eq } from 'drizzle-orm';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { getTeamByStripeCustomerId } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { teamMembers } from '@/lib/db/schema';
import { getPostHogClient } from '@/lib/posthog-server';
import { buffer } from 'micro';

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

      const subStatus = subscription.status;
      if (
        subStatus === 'active' ||
        subStatus === 'trialing' ||
        subStatus === 'canceled' ||
        subStatus === 'unpaid'
      ) {
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
              const eventName =
                subStatus === 'active' || subStatus === 'trialing'
                  ? 'subscription_activated'
                  : 'subscription_cancelled';
              posthog.capture({
                distinctId: String(ownerRow[0].userId),
                event: eventName,
                properties: { status: subStatus, plan_name: team.planName }
              });
              await posthog.flush();
            }
          }
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
