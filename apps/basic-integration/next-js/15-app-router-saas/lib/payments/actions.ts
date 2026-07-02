'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const user = await getUser();
  
  // Capture customer portal open event
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: String(user.id),
    event: 'customer_portal_opened',
    properties: {
      email: user.email,
      teamId: team.id,
      planName: team.planName,
    },
  });
  
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
