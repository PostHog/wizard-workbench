import { useLocation } from "react-router";
import { useRef } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!posthogKey) {
    return <>{children}</>;
  }

  if (typeof window !== "undefined" && !posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false, // We capture pageviews manually
      capture_pageleave: true,
    });
  }

  return (
    <PHProvider client={posthog}>
      <PostHogPageviewTracker />
      {children}
    </PHProvider>
  );
}

function PostHogPageviewTracker() {
  const location = useLocation();
  const posthog = usePostHog();
  const lastPath = useRef<string | null>(null);

  // Track pageviews on route change
  if (location.pathname !== lastPath.current) {
    lastPath.current = location.pathname;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }

  return null;
}

export { usePostHog };
