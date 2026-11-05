import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-js/react";
import posthog, { isPostHogConfigured } from "./lib/posthog.client";

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
