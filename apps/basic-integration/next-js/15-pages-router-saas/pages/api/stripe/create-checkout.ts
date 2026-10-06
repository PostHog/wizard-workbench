import { SeverityNumber } from '@opentelemetry/api-logs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { emitPostHogLog } from '@/lib/posthog-logs';

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
    await emitPostHogLog('checkout session created', {
      event: 'checkout_session_created',
      route: '/api/stripe/create-checkout',
      outcome: 'success'
    });
    return res.status(200).json(result);
  } catch (error) {
    await emitPostHogLog(
      'checkout session creation failed',
      {
        event: 'checkout_session_created',
        route: '/api/stripe/create-checkout',
        outcome: 'failure'
      },
      SeverityNumber.ERROR
    );
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
