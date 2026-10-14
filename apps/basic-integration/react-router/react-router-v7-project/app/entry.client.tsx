import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogProjectToken
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    logs: {
      serviceName: "rrv7-project-web",
      environment: import.meta.env.MODE,
    },
  });
  posthog.logger.info("client hydration started", {
    event: "client_hydration_started",
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
