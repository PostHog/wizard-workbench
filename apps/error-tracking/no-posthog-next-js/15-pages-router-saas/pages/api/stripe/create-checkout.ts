import type { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getTeamForUser } from '@/lib/db/queries';

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
    return res.status(200).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
