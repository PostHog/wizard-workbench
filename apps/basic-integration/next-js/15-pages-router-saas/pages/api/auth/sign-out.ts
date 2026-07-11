import type { NextApiRequest, NextApiResponse } from 'next';
import { flushPostHogServerClient, getPostHogServerClient } from '@/lib/posthog-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const distinctIdHeader = req.headers['x-posthog-distinct-id'];
    const distinctId = Array.isArray(distinctIdHeader)
      ? distinctIdHeader[0]
      : distinctIdHeader;

    if (distinctId) {
      const posthog = getPostHogServerClient();
      posthog.capture({
        distinctId,
        event: 'user_signed_out',
        properties: {
          source: 'api'
        }
      });
      await flushPostHogServerClient();
    }

    // Delete the session cookie by setting it with an expired date
    res.setHeader(
      'Set-Cookie',
      'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    const posthog = getPostHogServerClient();
    posthog.captureException(error, 'sign-out-handler');
    await flushPostHogServerClient();
    console.error('Sign out error:', error);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
}
