import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * PostHog Analytics Provider for React Router 7
 *
 * This component initializes PostHog and tracks page views automatically.
 * It uses environment variables for configuration:
 * - VITE_POSTHOG_API_KEY: Your PostHog project API key
 * - VITE_POSTHOG_HOST: Your PostHog instance URL
 */

interface PostHogProviderProps {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const location = useLocation();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST;

    // Only initialize PostHog if API key is provided
    if (apiKey && typeof window !== "undefined") {
      posthog.init(apiKey, {
        api_host: host || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // We'll capture pageviews manually for SPA
        capture_pageleave: true,
      });
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
