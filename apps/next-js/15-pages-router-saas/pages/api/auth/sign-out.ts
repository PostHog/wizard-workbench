// QUACK QUACK IM A BIG FLUFFY DOG
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user before clearing session for tracking
    const sessionCookie = req.cookies.session;
    const user = await getUser(sessionCookie);

    // PostHog server-side tracking for user sign-out
    if (user) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: user.email,
        event: 'user_signed_out',
        properties: {
          email: user.email,
          user_id: user.id,
          source: 'api'
        }
      });
    }

    // Delete the session cookie by setting it with an expired date
    res.setHeader(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
}
