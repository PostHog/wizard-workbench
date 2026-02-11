import type { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { getPostHogClient } from '@/lib/posthog-server';

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

    // PostHog: Track checkout started event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'checkout_started',
      properties: {
        price_id: priceId,
        team_id: team.id,
        team_name: team.name,
        email: user.email,
      },
    });

    const result = await createCheckoutSession({ team, priceId, userId: user.id });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Checkout error:', error);

    // PostHog: Capture checkout error
    const posthog = getPostHogClient();
    posthog.captureException(error as Error);

    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
