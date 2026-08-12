import { PostHog } from 'posthog-node';

try {
  process.loadEnvFile?.();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

function requireConfiguration(name, value) {
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error(
      `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`
    );
  }
}

requireConfiguration('POSTHOG_PROJECT_TOKEN', projectToken);
requireConfiguration('POSTHOG_HOST', host);

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        enableExceptionAutocapture: true,
      })
    : undefined;
