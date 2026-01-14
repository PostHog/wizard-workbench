import { useEffect } from "react";
import { useLocation } from "react-router";
import posthog from "posthog-js";

// Initialize PostHog only on the client side
let isPostHogInitialized = false;

function initPostHog() {
  if (typeof window === "undefined" || isPostHogInitialized) return;

  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!apiKey) {
    console.warn("PostHog API key not found. Skipping initialization.");
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // We handle pageviews manually for SPA navigation
    capture_pageleave: true,
  });

  isPostHogInitialized = true;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== "undefined" && isPostHogInitialized) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: location.pathname,
      });
    }
  }, [location.pathname]);

  return <>{children}</>;
}

export { posthog };
