'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const posthog = getPostHogClient();
  posthog.capture({ distinctId: String(team.teamMembers[0]?.user.id ?? 'unknown'), event: 'pricing_get_started_clicked', properties: { price_id: priceId } });
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const posthog = getPostHogClient();
  posthog.capture({ distinctId: String(team.teamMembers[0]?.user.id ?? 'unknown'), event: 'customer_portal_opened' });
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
