import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  activityLogs,
  type NewActivityLog,
  ActivityType
} from '@/lib/db/schema';
import { getUser, getUserWithTeam } from '@/lib/db/queries';

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || ''
  };
  await db.insert(activityLogs).values(newActivity);
}

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

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

    const validation = updateAccountSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.errors[0]?.message || 'Invalid input'
      });
    }

    const { name, email } = validation.data;
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT)
    ]);

    return res.status(200).json({ name, success: 'Account updated successfully.' });
  } catch (error) {
    console.error('Update account error:', error);
    return res.status(500).json({ error: 'Failed to update account' });
  }
}
