import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { HydratedRouter } from "react-router/dom";

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogProjectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_PROJECT_TOKEN is configured"
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured"
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: "2026-05-30",
  });
}

const router = <HydratedRouter />;

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {posthogProjectToken && posthogHost ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>{router}</PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        router
      )}
    </StrictMode>
  );
});
