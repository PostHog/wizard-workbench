import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

if (!apiKey || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const variableName = !apiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
    );
  }
}

export const posthog = apiKey && host
  ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
  : null;
