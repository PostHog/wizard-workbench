import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import posthog from "./posthog.client";

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
