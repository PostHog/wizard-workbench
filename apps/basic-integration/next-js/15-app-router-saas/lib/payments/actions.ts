'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient, shutdownPostHog } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const posthog = getPostHogClient();

  try {
    posthog.capture({
      distinctId: team.id.toString(),
      event: 'checkout_started',
      properties: {
        team_id: team.id,
        has_stripe_customer_id: Boolean(team.stripeCustomerId),
        price_id: priceId
      }
    });
  } finally {
    await shutdownPostHog();
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
