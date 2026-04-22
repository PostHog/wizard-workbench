import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import {
  users,
  teams,
  teamMembers,
  activityLogs,
  type NewActivityLog,
  ActivityType
} from '@/lib/db/schema';
import { comparePasswords, setSession } from '@/lib/auth/session';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getPostHogClient } from '@/lib/posthog-server';

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

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, redirect, priceId } = req.body;

    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid email or password format.',
        email,
        password
      });
    }

    const userWithTeam = await db
      .select({
        user: users,
        team: teams
      })
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .leftJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(users.email, email))
      .limit(1);

    if (userWithTeam.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password. Please try again.',
        email,
        password
      });
    }

    const { user: foundUser, team: foundTeam } = userWithTeam[0];

    const isPasswordValid = await comparePasswords(
      password,
      foundUser.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password. Please try again.',
        email,
        password
      });
    }

    await Promise.all([
      setSession(foundUser, res),
      logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN)
    ]);

    const distinctId = (req.headers['x-posthog-distinct-id'] as string) || foundUser.email;
    const sessionId = req.headers['x-posthog-session-id'] as string | undefined;
    const posthog = getPostHogClient();
    posthog.identify({ distinctId: foundUser.email, properties: { email: foundUser.email, name: foundUser.name } });
    posthog.capture({
      distinctId,
      event: 'sign_in',
      properties: {
        email: foundUser.email,
        ...(sessionId ? { $session_id: sessionId } : {}),
      },
    });

    if (redirect === 'checkout' && foundTeam) {
      const checkoutResult = await createCheckoutSession({
        team: foundTeam,
        priceId,
        userId: foundUser.id
      });
      return res.status(200).json(checkoutResult);
    }

    return res.status(200).json({ success: true, redirectTo: '/dashboard' });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ error: 'Failed to sign in. Please try again.' });
  }
}
