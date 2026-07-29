import posthog from 'posthog-js';
import 'posthog-js/dist/exception-autocapture';

const token = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const isProduction = import.meta.env.PROD;
const isPostHogConfigured = Boolean(token && apiHost);

if (isPostHogConfigured) {
  posthog.init(token, {
    api_host: apiHost,
    defaults: '2026-05-30',
  });
  posthog.startExceptionAutocapture({
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: false,
  });
} else if (!isProduction) {
  const missingVariable = !token ? 'VITE_POSTHOG_KEY' : 'VITE_POSTHOG_HOST';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export { isPostHogConfigured, posthog };
export default posthog;
