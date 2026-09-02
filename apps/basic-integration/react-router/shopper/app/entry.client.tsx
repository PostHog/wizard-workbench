import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;
const posthogClient = projectToken && host ? posthog : undefined;

if (posthogClient) {
  posthogClient.init(projectToken, {
    api_host: host,
    defaults: "2026-01-30",
  });
} else if (import.meta.env.DEV) {
  for (const variableName of [
    !projectToken && "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN",
    !host && "VITE_PUBLIC_POSTHOG_HOST",
  ]) {
    if (variableName) {
      console.error(
        new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
        )
      );
    }
  }
}

const app = posthogClient ? (
  <PostHogProvider client={posthogClient}>
    <PostHogErrorBoundary>
      <HydratedRouter />
    </PostHogErrorBoundary>
  </PostHogProvider>
) : (
  <HydratedRouter />
);

hydrateRoot(document, <StrictMode>{app}</StrictMode>);
