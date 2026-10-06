import { SeverityNumber } from '@opentelemetry/api-logs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createCustomerPortalSession } from '@/lib/payments/stripe';
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
    const user = await getUser(sessionCookie);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const team = await getTeamForUser(sessionCookie);

    if (!team) {
      return res.status(400).json({ error: 'Team not found' });
    }

    const portalSession = await createCustomerPortalSession(team);
    await emitPostHogLog('customer portal session created', {
      event: 'customer_portal_session_created',
      route: '/api/stripe/customer-portal',
      outcome: 'success'
    });
    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    await emitPostHogLog(
      'customer portal session creation failed',
      {
        event: 'customer_portal_session_created',
        route: '/api/stripe/customer-portal',
        outcome: 'failure'
      },
      SeverityNumber.ERROR
    );
    console.error('Customer portal error:', error);
    return res.status(500).json({ error: 'Failed to create customer portal session' });
  }
}
