import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// Initialize PostHog on the client side only
posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24", // Use latest defaults for automatic SPA pageview tracking
  capture_pageview: "history-change", // Capture pageviews on route changes
  capture_pageleave: "if-capture-pageview", // Track page leaves
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <PostHogProvider client={posthog}>
        <HydratedRouter />
      </PostHogProvider>
    </StrictMode>
  );
});
