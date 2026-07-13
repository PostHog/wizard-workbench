import type { NextApiRequest, NextApiResponse } from 'next';
import { getDistinctId } from '@/lib/posthog-shared';
import { flushPostHogServerClient, getPostHogServerClient } from '@/lib/posthog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posthog = getPostHogServerClient();
    const sessionCookie = req.cookies.session;

    posthog.capture({
      distinctId: getDistinctId(sessionCookie || 'anonymous-sign-out'),
      event: 'user_signed_out',
      properties: {
        had_session: Boolean(sessionCookie)
      }
    });

    await flushPostHogServerClient();

    // Delete the session cookie by setting it with an expired date
    res.setHeader(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    getPostHogServerClient().captureException(error, getDistinctId('sign-out-handler'));
    await flushPostHogServerClient();
    return res.status(500).json({ error: 'Failed to sign out' });
  }
}
