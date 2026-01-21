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
    // Get user info before clearing session for PostHog tracking
    const sessionCookie = req.cookies.session;
    let userEmail: string | undefined;

    if (sessionCookie) {
      try {
        const user = await getUser(sessionCookie);
        userEmail = user?.email;
      } catch {
        // Session invalid, continue with sign out
      }
    }

    // Capture server-side sign-out event
    if (userEmail) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: userEmail,
        event: 'user_signed_out',
        properties: {
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
