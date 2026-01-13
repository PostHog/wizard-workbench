'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();

  // Track checkout started event in PostHog
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'checkout_started',
      properties: {
        email: user.email,
        teamId: team.id,
        teamName: team.name,
        priceId,
        planName: team.planName
      }
    });
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();

  // Track subscription portal opened event in PostHog
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'subscription_portal_opened',
      properties: {
        email: user.email,
        teamId: team.id,
        teamName: team.name,
        currentPlan: team.planName,
        subscriptionStatus: team.subscriptionStatus
      }
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
