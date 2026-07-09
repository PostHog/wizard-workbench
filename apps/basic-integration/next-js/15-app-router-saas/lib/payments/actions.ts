'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  await captureServerEvent({
    distinctId: `team:${team.id}`,
    event: 'checkout_started',
    properties: {
      team_id: team.id,
      price_id: priceId,
      has_active_subscription: Boolean(team.stripeSubscriptionId)
    }
  });

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);

  await captureServerEvent({
    distinctId: `team:${team.id}`,
    event: 'billing_portal_opened',
    properties: {
      team_id: team.id,
      plan_name: team.planName,
      subscription_status: team.subscriptionStatus
    }
  });

  redirect(portalSession.url);
});
