import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { HydratedRouter } from "react-router/dom";

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const posthogEnabled = Boolean(posthogToken && posthogHost);

if (!posthogEnabled) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogToken
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    logs: {
      serviceName: "rrv7-project-web",
      environment: import.meta.env.MODE,
    },
  });
}

startTransition(() => {
  const router = <HydratedRouter />;

  hydrateRoot(
    document,
    <StrictMode>
      {posthogEnabled ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>{router}</PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        router
      )}
    </StrictMode>,
  );
});
