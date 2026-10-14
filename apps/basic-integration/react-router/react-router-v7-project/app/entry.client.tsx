import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-js/react";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: "rrv7-project-web",
      environment: import.meta.env.MODE,
    },
  });

  const posthogLog = {
    info: (message: string, attributes: Record<string, string>) => {
      posthog.logger.info(message, attributes);
    },
  };

  posthogLog.info("browser PostHog client initialized", { runtime: "browser" });

  window.addEventListener("posthog:identify", (event) => {
    const { distinctId, personProperties } = (
      event as CustomEvent<{
        distinctId: string;
        personProperties: Record<string, string>;
      }>
    ).detail;

    posthog.identify(distinctId, personProperties);
    posthogLog.info("browser identity synchronized", { source: "auth_context" });
  });
  window.addEventListener("posthog:reset", () => {
    posthog.reset();
    posthogLog.info("browser identity reset", { source: "auth_context" });
  });
  window.addEventListener("posthog:capture", (event) => {
    const { eventName, properties } = (
      event as CustomEvent<{
        eventName: string;
        properties?: Record<string, string | number | boolean>;
      }>
    ).detail;

    posthog.capture(eventName, properties);
    posthogLog.info("product analytics event forwarded", { event_name: eventName });
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogKey
    ? "VITE_PUBLIC_POSTHOG_HOST"
    : "VITE_PUBLIC_POSTHOG_KEY";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {posthogKey && posthogHost ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>
            <HydratedRouter />
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <HydratedRouter />
      )}
    </StrictMode>,
  );
});
