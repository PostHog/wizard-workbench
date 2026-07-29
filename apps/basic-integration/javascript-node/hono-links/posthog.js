import 'dotenv/config';
import { PostHog } from 'posthog-node';

const apiKey = process.env.POSTHOG_API_KEY;
const host = process.env.POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === 'production';

function missingConfiguration(variable) {
  if (!isProduction) {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
    );
  }
}

if (!apiKey) missingConfiguration('POSTHOG_API_KEY');
if (!host) missingConfiguration('POSTHOG_HOST');

export const posthog = apiKey && host
  ? new PostHog(apiKey, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;

export default posthog;
