import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';
import { getPostHogClient } from '@/lib/posthog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id || typeof session_id !== 'string') {
    return res.redirect('/pricing');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer', 'subscription']
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product']
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      throw new Error('User not found in database.');
    }

    const userTeam = await db
      .select({
        teamId: teamMembers.teamId
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user[0].id))
      .limit(1);

    if (userTeam.length === 0) {
      throw new Error('User is not associated with any team.');
    }

    await db
      .update(teams)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: (plan.product as Stripe.Product).name,
        subscriptionStatus: subscription.status,
        updatedAt: new Date()
      })
      .where(eq(teams.id, userTeam[0].teamId));

    // Capture checkout completed event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user[0].email,
      event: 'checkout_completed',
      properties: {
        user_id: user[0].id,
        email: user[0].email,
        team_id: userTeam[0].teamId,
        plan_name: (plan.product as Stripe.Product).name,
        subscription_id: subscriptionId,
        customer_id: customerId,
        subscription_status: subscription.status,
        source: 'api'
      }
    });

    await setSession(user[0]);
    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return res.redirect('/error');
  }
}
