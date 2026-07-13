import type { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { getDistinctId } from '@/lib/posthog-shared';
import { flushPostHogServerClient, getPostHogServerClient } from '@/lib/posthog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionCookie = req.cookies.session;
    const priceId = req.body.priceId as string;

    const user = await getUser(sessionCookie);
    const team = user ? await getTeamForUser(sessionCookie) : null;

    if (!team || !user) {
      // Redirect to sign up if no team
      return res.status(200).json({
        redirectTo: `/sign-up?redirect=checkout&priceId=${priceId}`
      });
    }

    const result = await createCheckoutSession({ team, priceId, userId: user.id });

    getPostHogServerClient().capture({
      distinctId: getDistinctId(user.id),
      event: 'checkout_session_created',
      properties: {
        price_id: priceId,
        team_id: team.id,
        team_name: team.name,
        redirect_to_checkout: Boolean(result.url)
      }
    });

    await flushPostHogServerClient();

    return res.status(200).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    getPostHogServerClient().captureException(error, getDistinctId('create-checkout-handler'));
    await flushPostHogServerClient();
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
