import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/lib/db/queries';
import { getPostHogClient } from '@/lib/posthog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user before clearing session for PostHog tracking
    const sessionCookie = req.cookies.session;
    const user = await getUser(sessionCookie);

    // Delete the session cookie by setting it with an expired date
    res.setHeader(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    // PostHog: Capture user_signed_out event
    if (user) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: String(user.id),
        event: 'user_signed_out',
        properties: {
          user_id: user.id,
          source: 'api'
        }
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    // PostHog: Capture error
    const posthog = getPostHogClient();
    posthog.captureException(error);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
}
