'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getDistinctIdForUser } from '@/lib/posthog-shared';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();

  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: getDistinctIdForUser(user),
      event: 'checkout_started',
      properties: {
        team_id: team.id,
        price_id: priceId,
        has_existing_subscription: Boolean(team.stripeSubscriptionId)
      }
    });
    await posthog.flush();
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();

  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: getDistinctIdForUser(user),
      event: 'billing_portal_opened',
      properties: {
        team_id: team.id,
        plan_name: team.planName ?? 'free'
      }
    });
    await posthog.flush();
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
