'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { captureServerEvent } from '@/lib/posthog-server';
import { emitPostHogLog } from '@/lib/posthog-logs';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  await Promise.all([
    captureServerEvent(String(user.id), 'subscription_checkout_started'),
    emitPostHogLog('subscription checkout started')
  ]);
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
