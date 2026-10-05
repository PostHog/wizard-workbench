import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import posthog from "posthog-js";
import { HydratedRouter } from "react-router/dom";

declare global {
  interface Window {
    __posthogCapture?: typeof posthog.capture;
    __posthogLog?: (
      message: string,
      attributes?: Record<string, string | number | boolean>,
    ) => void;
  }
}

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!projectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!host) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
  });
  window.__posthogCapture = posthog.capture.bind(posthog);
  window.__posthogLog = (message, attributes) => {
    posthog.logger.info(message, attributes);
  };
}

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>,
);
