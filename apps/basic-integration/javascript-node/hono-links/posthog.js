import 'dotenv/config';
import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogConfiguration(variableName) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

if (!projectToken) requirePostHogConfiguration('POSTHOG_PROJECT_TOKEN');
if (!host) requirePostHogConfiguration('POSTHOG_HOST');

export const posthog = projectToken && host
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;
