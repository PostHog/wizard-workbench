'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { getPostHogClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: String(user.id),
      event: 'checkout_initiated',
      properties: {
        team_id: team.id,
        price_id: priceId,
        plan_name: team.planName,
      },
    });
    await posthog.shutdown();
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: String(user.id),
      event: 'customer_portal_opened',
      properties: {
        team_id: team.id,
        plan_name: team.planName,
      },
    });
    await posthog.shutdown();
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
