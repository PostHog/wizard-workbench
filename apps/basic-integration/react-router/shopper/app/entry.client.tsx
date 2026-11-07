import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogKey && posthogHost);

if (import.meta.env.DEV) {
  if (!posthogKey) {
    console.error(
      new Error(
        "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured",
      ),
    );
  }
  if (!posthogHost) {
    console.error(
      new Error(
        "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured",
      ),
    );
  }
}

if (isPostHogConfigured) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
  });
}

const app = isPostHogConfigured ? (
  <PostHogProvider client={posthog}>
    <PostHogErrorBoundary>
      <HydratedRouter />
    </PostHogErrorBoundary>
  </PostHogProvider>
) : (
  <HydratedRouter />
);

startTransition(() => {
  hydrateRoot(document, <StrictMode>{app}</StrictMode>);
});
