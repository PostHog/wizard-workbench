import 'dotenv/config';
import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;

if (!apiKey || !host) {
  if (process.env.NODE_ENV !== 'production') {
    const variable = !apiKey ? 'POSTHOG_API_KEY' : 'POSTHOG_HOST';
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
}

export const posthog = apiKey && host
  ? new PostHog(apiKey, { host, enableExceptionAutocapture: true })
  : undefined;
