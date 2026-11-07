import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!token || !host) && process.env.NODE_ENV !== 'production') {
  console.warn(
    `${!token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} is configured`
  );
}

export const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;
