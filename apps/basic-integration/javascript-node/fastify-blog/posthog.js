import { PostHog } from 'posthog-node';

const posthogKey = process.env.POSTHOG_KEY;
const posthogHost = process.env.POSTHOG_HOST;

if (!posthogKey && process.env.NODE_ENV !== 'production') {
  console.error(new Error('POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_KEY is configured'));
}

if (!posthogHost && process.env.NODE_ENV !== 'production') {
  console.error(new Error('POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured'));
}

const posthog = posthogKey && posthogHost
  ? new PostHog(posthogKey, { host: posthogHost, enableExceptionAutocapture: true })
  : null;

export default posthog;
