import { PostHog } from 'posthog-node';

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

if ((!token || !host) && !isProduction) {
  const missing = !token ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST';
  throw new Error(
    `${missing} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missing} is configured`
  );
}

export const posthog = token && host
  ? new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
    })
  : null;

export default posthog;
