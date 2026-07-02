'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { getPostHogClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const ph = getPostHogClient();
  ph.capture({ distinctId: String(team?.id ?? 'unknown'), event: 'checkout_started', properties: { price_id: priceId } });
  await createCheckoutSession({ team: team, priceId });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const ph = getPostHogClient();
  ph.capture({ distinctId: String(team.id), event: 'customer_portal_opened' });
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
