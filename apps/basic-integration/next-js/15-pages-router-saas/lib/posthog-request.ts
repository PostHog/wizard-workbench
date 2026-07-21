import type { NextApiRequest } from 'next';

export function getPostHogDistinctId(req: NextApiRequest, userId?: number) {
  const header = req.headers['x-posthog-distinct-id'];
  const anonymousId = Array.isArray(header) ? header[0] : header;

  return userId ? String(userId) : anonymousId || 'server';
}

export function getPostHogSessionId(req: NextApiRequest) {
  const header = req.headers['x-posthog-session-id'];
  return Array.isArray(header) ? header[0] : header;
}
