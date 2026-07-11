'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogServerClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const posthog = getPostHogServerClient();

  posthog.capture({
    distinctId: String(team.teamMembers[0]?.userId ?? team.id),
    event: 'checkout_started',
    properties: {
      team_id: team.id,
      price_id: priceId,
      current_plan: team.planName ?? 'Free'
    }
  });

  await posthog.flush();
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const posthog = getPostHogServerClient();

  posthog.capture({
    distinctId: String(team.teamMembers[0]?.userId ?? team.id),
    event: 'customer_portal_opened',
    properties: {
      team_id: team.id,
      current_plan: team.planName ?? 'Free'
    }
  });

  await posthog.flush();

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
