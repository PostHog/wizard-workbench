'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();

  // PostHog: Track checkout started
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'checkout_started',
      properties: {
        price_id: priceId,
        team_id: team?.id,
        team_name: team?.name,
      },
    });
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();

  // PostHog: Track manage subscription clicked
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'manage_subscription_clicked',
      properties: {
        team_id: team?.id,
        plan_name: team?.planName,
        subscription_status: team?.subscriptionStatus,
      },
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
