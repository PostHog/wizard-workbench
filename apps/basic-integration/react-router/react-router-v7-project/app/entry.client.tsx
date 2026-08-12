import { startTransition, StrictMode } from "react";
import posthog from "posthog-js";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if ((!posthogProjectToken || !posthogHost) && import.meta.env.DEV) {
  const missingVariable = !posthogProjectToken
    ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
    : "VITE_PUBLIC_POSTHOG_HOST";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

if (posthogProjectToken && posthogHost) {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
