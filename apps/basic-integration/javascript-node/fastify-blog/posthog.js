import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

if ((!projectToken || !host) && process.env.NODE_ENV !== 'production') {
  const missingVariable = !projectToken ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
  })
  : null;
