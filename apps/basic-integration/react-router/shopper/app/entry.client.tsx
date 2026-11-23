import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";

const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;

if (!posthogToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured"
    );
  }
} else {
  posthog.init(posthogToken, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
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
  </StrictMode>
);
