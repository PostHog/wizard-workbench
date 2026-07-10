'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';
import { createPostHogServerClient } from '@/lib/posthog-server';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const posthog = createPostHogServerClient();

  try {
    posthog.capture({
      distinctId: String(team.id),
      event: 'pricing_checkout_started',
      properties: {
        price_id: priceId,
        plan_name: team.planName,
        source: 'pricing_page'
      }
    });

    await posthog.shutdown();
    await createCheckoutSession({ team: team, priceId });
  } catch (error) {
    posthog.captureException(error, String(team.id), {
      area: 'checkout_action'
    });
    await posthog.shutdown();
    throw error;
  }
});

export const customerPortalAction = withTeam(async (_, team) => {
  const posthog = createPostHogServerClient();

  try {
    posthog.capture({
      distinctId: String(team.id),
      event: 'subscription_portal_opened',
      properties: {
        plan_name: team.planName,
        subscription_status: team.subscriptionStatus
      }
    });

    await posthog.shutdown();
    const portalSession = await createCustomerPortalSession(team);
    redirect(portalSession.url);
  } catch (error) {
    posthog.captureException(error, String(team.id), {
      area: 'customer_portal_action'
    });
    await posthog.shutdown();
    throw error;
  }
});
