import { PostHog } from 'posthog-node';

const key = process.env.POSTHOG_KEY;
const host = process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com';

if (!key) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(
      'POSTHOG_KEY variable required by PostHog is missing or un-configured, ' +
        'this causes events to be silently missed. ' +
        'This error stops appearing once POSTHOG_KEY is configured',
    );
  }
}

export const posthog = key
  ? new PostHog(key, {
      host,
      metrics: { serviceName: 'nextjs-storefront' },
    })
  : null;
