'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  await captureServerEvent({
    distinctId: team.teamMembers[0]?.user.id.toString() || `team-${team.id}`,
    event: 'checkout_started',
    properties: {
      team_id: team.id,
      price_id: priceId,
      current_plan_name: team.planName ?? 'Free'
    }
  });

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  await captureServerEvent({
    distinctId: team.teamMembers[0]?.user.id.toString() || `team-${team.id}`,
    event: 'billing_portal_opened',
    properties: {
      team_id: team.id,
      current_plan_name: team.planName ?? 'Free',
      subscription_status: team.subscriptionStatus ?? 'none'
    }
  });

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
