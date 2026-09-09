import 'dotenv/config';
import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requirePostHogEnvironment(variableName, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

requirePostHogEnvironment('POSTHOG_PROJECT_TOKEN', projectToken);
requirePostHogEnvironment('POSTHOG_HOST', host);

export const posthog = projectToken && host
  ? new PostHog(projectToken, {
      host,
      enableExceptionAutocapture: true,
    })
  : null;
