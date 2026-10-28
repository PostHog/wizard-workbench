import { existsSync } from 'node:fs';
import { PostHog } from 'posthog-node';

if (existsSync('.env')) {
  process.loadEnvFile?.('.env');
}

const projectToken = process.env.POSTHOG_PROJECT_TOKEN?.trim();
const host = process.env.POSTHOG_HOST?.trim();

if (!projectToken || !host) {
  const missingVariable = projectToken ? 'POSTHOG_HOST' : 'POSTHOG_PROJECT_TOKEN';

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

export const posthogConfig = projectToken && host ? { projectToken, host } : null;

export const posthog = posthogConfig
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;
