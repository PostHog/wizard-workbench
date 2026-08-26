import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogToken && posthogHost);

if (!isPostHogConfigured) {
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
    defaults: "2026-05-30",
  });
}

startTransition(() => {
  const router = <HydratedRouter />;
  const app = isPostHogConfigured ? (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>{router}</PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    router
  );

  hydrateRoot(document, <StrictMode>{app}</StrictMode>);
});
