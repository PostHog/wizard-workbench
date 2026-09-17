'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team, user) => {
  const priceId = formData.get('priceId') as string;
  await captureServerEvent({
    distinctId: user.id.toString(),
    event: 'checkout_started'
  });
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team, user) => {
  const portalSession = await createCustomerPortalSession(team);
  await captureServerEvent({
    distinctId: user.id.toString(),
    event: 'subscription_portal_opened'
  });
  redirect(portalSession.url);
});
