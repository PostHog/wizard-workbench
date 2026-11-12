import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

export const isPostHogEnabled = Boolean(posthogKey && posthogHost);

if (!isPostHogEnabled && import.meta.env.DEV) {
  if (!posthogKey) {
    console.error(
      new Error(
        'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured',
      ),
    );
  }

  if (!posthogHost) {
    console.error(
      new Error(
        'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured',
      ),
    );
  }
}

if (isPostHogEnabled) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-08-30',
    capture_pageview: 'history_change',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: 'trackflow-web',
      environment: import.meta.env.MODE,
    },
  });
}

export const posthogLogger = {
  info(message, attributes) {
    if (isPostHogEnabled) posthog.logger.info(message, attributes);
  },
};

export default posthog;
