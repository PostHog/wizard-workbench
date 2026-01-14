import type { NextApiRequest, NextApiResponse } from 'next';
import { createCustomerPortalSession } from '@/lib/payments/stripe';
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
    const user = await getUser(sessionCookie);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const team = await getTeamForUser(sessionCookie);

    if (!team) {
      return res.status(400).json({ error: 'Team not found' });
    }

    const portalSession = await createCustomerPortalSession(team);

    // PostHog: Capture customer portal opened event
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'customer_portal_opened',
      properties: {
        user_id: user.id,
        email: user.email,
        team_id: team.id,
        team_name: team.name,
        plan_name: team.planName,
        subscription_status: team.subscriptionStatus,
        source: 'api'
      }
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error('Customer portal error:', error);
    return res.status(500).json({ error: 'Failed to create customer portal session' });
  }
}
