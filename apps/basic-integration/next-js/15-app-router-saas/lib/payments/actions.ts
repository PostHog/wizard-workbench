'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();
  if (user) {
    await captureServerEvent({
      distinctId: user.id.toString(),
      event: 'billing_portal_opened',
      properties: { team_id: team.id }
    });
  }

  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
