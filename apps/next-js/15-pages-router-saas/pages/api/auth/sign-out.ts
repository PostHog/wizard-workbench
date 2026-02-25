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

    if (user) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: user.email,
        event: 'user_signed_out',
        properties: {
          email: user.email,
        },
      });
      await posthog.shutdown();
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
