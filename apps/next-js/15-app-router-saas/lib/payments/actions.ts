// QUACK QUACK IM A BIG FLUFFY DOG
'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();

  // PostHog: Track checkout started event
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'checkout_started',
      properties: {
        user_id: user.id,
        team_id: team?.id,
        price_id: priceId,
        source: 'server'
      }
    });
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();

  // PostHog: Track subscription portal opened event
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: user.email,
      event: 'subscription_portal_opened',
      properties: {
        user_id: user.id,
        team_id: team?.id,
        current_plan: team?.planName,
        source: 'server'
      }
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
