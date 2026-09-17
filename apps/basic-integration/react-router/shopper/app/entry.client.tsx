import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_POSTHOG_HOST;

if (!projectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!host) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-05-30",
  });
}

const app = <HydratedRouter />;

hydrateRoot(
  document,
  <StrictMode>
    {projectToken && host ? (
      <PostHogProvider client={posthog}>
        <PostHogErrorBoundary>{app}</PostHogErrorBoundary>
      </PostHogProvider>
    ) : (
      app
    )}
  </StrictMode>,
);
