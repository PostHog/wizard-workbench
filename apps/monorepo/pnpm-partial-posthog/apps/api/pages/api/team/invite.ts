import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  teamMembers,
  activityLogs,
  invitations,
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

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
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

    const validation = inviteTeamMemberSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.errors[0]?.message || 'Invalid input'
      });
    }

    const { email, role } = validation.data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return res.status(400).json({ error: 'User is not part of a team' });
    }

    const existingMember = await db
      .select()
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(
        and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
      )
      .limit(1);

    if (existingMember.length > 0) {
      return res.status(400).json({ error: 'User is already a member of this team' });
    }

    const existingInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.teamId, userWithTeam.teamId),
          eq(invitations.status, 'pending')
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return res.status(400).json({ error: 'An invitation has already been sent to this email' });
    }

    await db.insert(invitations).values({
      teamId: userWithTeam.teamId,
      email,
      role,
      invitedBy: user.id,
      status: 'pending'
    });

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    return res.status(200).json({ success: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invite team member error:', error);
    return res.status(500).json({ error: 'Failed to invite team member' });
  }
}
