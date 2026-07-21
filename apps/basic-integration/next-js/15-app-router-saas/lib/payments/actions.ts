'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();
  if (user) {
    await captureServerEvent(String(user.id), 'checkout_started', {
      team_id: String(team.id),
      price_id: priceId
    });
  }
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();
  const portalSession = await createCustomerPortalSession(team);
  if (user) {
    await captureServerEvent(String(user.id), 'customer_portal_opened', {
      team_id: String(team.id)
    });
  }
  redirect(portalSession.url);
});
