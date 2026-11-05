import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { HydratedRouter } from "react-router/dom";

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogProjectToken || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = !posthogProjectToken
      ? "VITE_POSTHOG_PROJECT_TOKEN"
      : "VITE_POSTHOG_HOST";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <PostHogProvider client={posthog}>
        <PostHogErrorBoundary>
          <HydratedRouter />
        </PostHogErrorBoundary>
      </PostHogProvider>
    </StrictMode>,
  );
});
