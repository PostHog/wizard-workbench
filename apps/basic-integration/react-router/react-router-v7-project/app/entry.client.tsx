import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: "rrv7-project-web",
      environment: import.meta.env.MODE,
    },
  });

  const posthogLog = posthog.logger;
  posthogLog.info("browser log capture initialized", {
    component: "browser_entry",
  });

  window.addEventListener("posthog:identify-user", (event) => {
    const { id, email, username } = (event as CustomEvent<{
      id: string;
      email: string;
      username: string;
    }>).detail;

    posthog.identify(id, { email, username });
  });

  window.addEventListener("posthog:reset-user", () => {
    posthog.reset();
  });

  window.addEventListener("posthog:capture", (event) => {
    const { eventName, properties } = (event as CustomEvent<{
      eventName: string;
      properties?: Record<string, string | number | boolean>;
    }>).detail;

    posthog.capture(eventName, properties);

    const logMessages: Record<string, string> = {
      user_logged_in: "user login completed",
      user_signed_up: "user signup completed",
      user_logged_out: "user logout completed",
      country_claimed: "country claim completed",
      country_liked: "country like completed",
      country_visited: "country visit completed",
    };
    const message = logMessages[eventName];

    if (message) {
      posthogLog.info(message, { analytics_event: eventName });
    }
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogToken
    ? "VITE_PUBLIC_POSTHOG_HOST"
    : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";

  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
