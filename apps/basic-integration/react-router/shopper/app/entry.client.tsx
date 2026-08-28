import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { HydratedRouter } from "react-router/dom";

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!projectToken && import.meta.env.DEV) {
  throw new Error(
    "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
  );
}

if (!posthogHost && import.meta.env.DEV) {
  throw new Error(
    "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured"
  );
}

if (projectToken && posthogHost) {
  posthog.init(projectToken, {
    api_host: posthogHost,
    defaults: "2026-05-30",
  });
}

const app = <HydratedRouter />;

hydrateRoot(
  document,
  <StrictMode>
    {projectToken && posthogHost ? (
      <PostHogProvider client={posthog}>
        <PostHogErrorBoundary>{app}</PostHogErrorBoundary>
      </PostHogProvider>
    ) : (
      app
    )}
  </StrictMode>
);
