import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { isRouteErrorResponse, type ClientOnErrorFunction } from "react-router";
import { HydratedRouter } from "react-router/dom";
import { PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";

const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogToken && posthogHost);

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    capture_exceptions: true,
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogToken
    ? "VITE_POSTHOG_HOST"
    : "VITE_POSTHOG_PROJECT_TOKEN";
  console.error(
    new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    ),
  );
}

// React Router catches route, loader, action, and fetcher errors before browser-global handlers.
// Ignore intentional response errors and the sanitized client copy of server errors.
const onError: ClientOnErrorFunction = (error) => {
  if (!isPostHogConfigured || isRouteErrorResponse(error)) return;
  if (error instanceof Error && error.message === "Unexpected Server Error") return;
  posthog.captureException(error);
};

startTransition(() => {
  hydrateRoot(
    document,
    <PostHogProvider client={posthog}>
      <StrictMode>
        <HydratedRouter onError={onError} />
      </StrictMode>
    </PostHogProvider>,
  );
});
