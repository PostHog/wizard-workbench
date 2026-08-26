import 'dotenv/config';
import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
  throw new Error(
    `${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? 'POSTHOG_PROJECT_TOKEN' : 'POSTHOG_HOST'} is configured`,
  );
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;
