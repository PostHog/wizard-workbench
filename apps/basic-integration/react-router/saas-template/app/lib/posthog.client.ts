import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

export const isPostHogEnabled = Boolean(posthogKey && posthogHost);

if (isPostHogEnabled) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      environment: import.meta.env.MODE,
      serviceName: "saas-template-web",
    },
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogKey
    ? "VITE_POSTHOG_HOST"
    : "VITE_POSTHOG_KEY";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

type LogAttributes = Record<string, boolean | number | string>;

export const posthogLogger = {
  info(message: string, attributes: LogAttributes) {
    if (isPostHogEnabled) {
      posthog.logger.info(message, attributes);
    }
  },
};

export default posthog;
