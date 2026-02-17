import type { NextApiRequest, NextApiResponse } from 'next';
import { getTeamForUser } from '@/lib/db/queries';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionCookie = req.cookies.session;
    const team = await getTeamForUser(sessionCookie);
    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team' });
  }
}
