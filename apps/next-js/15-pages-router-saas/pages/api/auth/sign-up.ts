import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  teams,
  teamMembers,
  activityLogs,
  invitations,
  type NewUser,
  type NewTeam,
  type NewTeamMember,
  type NewActivityLog,
  ActivityType
} from '@/lib/db/schema';
import { hashPassword, setSession } from '@/lib/auth/session';
import { createCheckoutSession } from '@/lib/payments/stripe';

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

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, inviteId, redirect, priceId } = req.body;

    const validation = signUpSchema.safeParse({ email, password, inviteId });
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid input. Please check your email and password.',
        email,
        password
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: 'Failed to create user. Please try again.',
        email,
        password
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser: NewUser = {
      email,
      passwordHash,
      role: 'owner'
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    if (!createdUser) {
      return res.status(500).json({
        error: 'Failed to create user. Please try again.',
        email,
        password
      });
    }

    let teamId: number;
    let userRole: string;
    let createdTeam: typeof teams.$inferSelect | null = null;

    if (inviteId) {
      const [invitation] = await db
        .select()
        .from(invitations)
        .where(
          and(
            eq(invitations.id, parseInt(inviteId)),
            eq(invitations.email, email),
            eq(invitations.status, 'pending')
          )
        )
        .limit(1);

      if (invitation) {
        teamId = invitation.teamId;
        userRole = invitation.role;

        await db
          .update(invitations)
          .set({ status: 'accepted' })
          .where(eq(invitations.id, invitation.id));

        await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);

        [createdTeam] = await db
          .select()
          .from(teams)
          .where(eq(teams.id, teamId))
          .limit(1);
      } else {
        return res.status(400).json({
          error: 'Invalid or expired invitation.',
          email,
          password
        });
      }
    } else {
      const newTeam: NewTeam = {
        name: `${email}'s Team`
      };

      [createdTeam] = await db.insert(teams).values(newTeam).returning();

      if (!createdTeam) {
        return res.status(500).json({
          error: 'Failed to create team. Please try again.',
          email,
          password
        });
      }

      teamId = createdTeam.id;
      userRole = 'owner';

      await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
    }

    const newTeamMember: NewTeamMember = {
      userId: createdUser.id,
      teamId: teamId,
      role: userRole
    };

    await Promise.all([
      db.insert(teamMembers).values(newTeamMember),
      logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
      setSession(createdUser, res)
    ]);

    if (redirect === 'checkout' && createdTeam) {
      const checkoutResult = await createCheckoutSession({
        team: createdTeam,
        priceId,
        userId: createdUser.id
      });
      return res.status(200).json(checkoutResult);
    }

    return res.status(200).json({ success: true, redirectTo: '/dashboard' });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ error: 'Failed to sign up. Please try again.' });
  }
}
