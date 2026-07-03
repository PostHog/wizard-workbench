'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { captureServerEvent } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const planName = formData.get('planName') as string | null;
  const user = await getUser();

  if (user) {
    await captureServerEvent({
      distinctId: user.id.toString(),
      event: 'checkout_session_started',
      properties: {
        team_id: team.id,
        price_id: priceId,
        plan_name: planName,
        source: 'pricing_page'
      }
    });
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
