import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function requirePostHogEnvironmentVariable(name: string, value: string | undefined) {
  if (!value && process.env.NODE_ENV === 'development') {
    throw new Error(
      `${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`,
    );
  }

  return value;
}

const configuredProjectToken = requirePostHogEnvironmentVariable(
  'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN',
  projectToken,
);
const configuredHost = requirePostHogEnvironmentVariable(
  'NEXT_PUBLIC_POSTHOG_HOST',
  host,
);

if (configuredProjectToken && configuredHost) {
  posthog.init(configuredProjectToken, {
    api_host: configuredHost,
    defaults: '2025-05-24',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
}
