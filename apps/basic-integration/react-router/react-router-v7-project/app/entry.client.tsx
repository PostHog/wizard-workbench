import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogKey
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";

    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    logs: {
      serviceName: "country-explorer-web",
      environment: import.meta.env.MODE,
    },
  });
}

const app =
  posthogKey && posthogHost ? (
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
