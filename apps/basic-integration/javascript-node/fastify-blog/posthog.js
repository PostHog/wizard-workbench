import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!token || !host) && process.env.NODE_ENV !== 'production') {
  const variable = !token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
  );
}

export const posthog = token && host
  ? new PostHog(token, { host, enableExceptionAutocapture: true })
  : null;
