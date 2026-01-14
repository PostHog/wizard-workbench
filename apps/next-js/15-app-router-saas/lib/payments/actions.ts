'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  // PostHog: Track checkout initiation event
  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'checkout_initiated',
      properties: {
        priceId: priceId,
        teamId: team.id,
        teamName: team.name,
      }
    });
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  // PostHog: Track customer portal opened event
  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'customer_portal_opened',
      properties: {
        teamId: team.id,
        teamName: team.name,
        currentPlan: team.planName,
      }
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
