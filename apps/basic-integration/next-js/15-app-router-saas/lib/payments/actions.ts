'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getUser } from '@/lib/db/queries';
import { createServerPostHog } from '@/lib/posthog';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const user = await getUser();

  if (user) {
    const posthog = createServerPostHog();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'checkout_started',
      properties: { price_id: priceId, team_id: team.id, plan_name: team.planName },
    });
    await posthog.flush();
  }

  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  const user = await getUser();

  if (user) {
    const posthog = createServerPostHog();
    posthog.capture({
      distinctId: user.id.toString(),
      event: 'customer_portal_accessed',
      properties: { team_id: team.id, plan_name: team.planName },
    });
    await posthog.flush();
  }

  redirect(portalSession.url);
});
