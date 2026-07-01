'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { getPostHogClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);

  const user = await getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({ distinctId: user.id.toString(), event: 'customer_portal_accessed', properties: { team_id: team.id, email: user.email } });
  }

  redirect(portalSession.url);
});
