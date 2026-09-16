import { PostHog } from 'posthog-node';

const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST;

for (const [name, value] of Object.entries({ POSTHOG_PROJECT_TOKEN: projectToken, POSTHOG_HOST: host })) {
  if (!value && process.env.NODE_ENV !== 'production') {
    console.error(new Error(`${name} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${name} is configured`));
  }
}

export const posthog = projectToken && host
  ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
  : null;
