import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

// Initialize PostHog
posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
  __add_tracing_headers: true, // Enables cross-client/server session tracking
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <PostHogProvider client={posthog}>
        <HydratedRouter />
      </PostHogProvider>
    </StrictMode>,
  );
});
