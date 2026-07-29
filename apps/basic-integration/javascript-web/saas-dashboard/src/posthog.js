import posthog from 'posthog-js';
import 'posthog-js/dist/exception-autocapture';

const token = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;
export const isPostHogEnabled = Boolean(token && host);

if (!token) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured',
    );
  }
} else if (!host) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured',
    );
  }
} else {
  posthog.init(token, {
    api_host: host,
    defaults: '2026-05-30',
  });
  posthog.startExceptionAutocapture({
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
  });
}

export default posthog;
