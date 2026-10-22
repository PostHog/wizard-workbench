import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogKey) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured",
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    logs: {
      serviceName: "shopper-web",
      environment: import.meta.env.MODE,
    },
  });
}

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
