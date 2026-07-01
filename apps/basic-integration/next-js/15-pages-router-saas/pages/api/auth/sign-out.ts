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
    const sessionCookie = req.cookies.session;
    const user = sessionCookie ? await getUser(sessionCookie) : null;

    // Delete the session cookie by setting it with an expired date
    res.setHeader(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    if (user) {
      const clientDistinctId = req.headers['x-posthog-distinct-id'] as string | undefined;
      const sessionId = req.headers['x-posthog-session-id'] as string | undefined;
      const posthogDistinctId = clientDistinctId || user.email;

      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: posthogDistinctId,
        event: 'user_signed_out',
        properties: {
          email: user.email,
          ...(sessionId && { $session_id: sessionId }),
        },
      });
      await posthog.shutdown();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
}
