'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  // PostHog: Track checkout started event
  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'checkout_started',
      properties: {
        user_id: user.id,
        team_id: team.id,
        price_id: priceId,
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
      distinctId: user.email,
      event: 'customer_portal_opened',
      properties: {
        user_id: user.id,
        team_id: team.id,
      }
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
