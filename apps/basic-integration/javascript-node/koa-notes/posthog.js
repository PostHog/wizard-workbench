import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

export let posthog;

if (!apiKey || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !apiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
} else {
  posthog = new PostHog(apiKey, {
    host,
    enableExceptionAutocapture: true,
  });
}

export async function shutdownPostHog() {
  if (!posthog) return;

  await posthog.shutdown(3000).catch(() => {});
}
