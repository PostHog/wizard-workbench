import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { getCurrentUser, type FakeUser } from "./lib/utils/auth";

function identifyUser(user: FakeUser) {
  posthog.identify(user.id, {
    email: user.email,
    username: user.username,
  });
}

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogProjectToken) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
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
  posthogLog.info("browser log capture configured", {
    runtime: "browser",
  });

  const currentUser = getCurrentUser();
  if (currentUser) {
    identifyUser(currentUser);
    posthogLog.info("authenticated browser identity synchronized", {
      source: "initial_page_load",
    });
  }

  window.addEventListener("posthog:identify_user", (event) => {
    identifyUser((event as CustomEvent<FakeUser>).detail);
    posthogLog.info("authenticated browser identity synchronized", {
      source: "auth_transition",
    });
  });
  window.addEventListener("posthog:capture", (event) => {
    const { event: eventName, properties } = (event as CustomEvent<{
      event: string;
      properties?: Record<string, unknown>;
    }>).detail;
    posthog.capture(eventName, properties);
    posthogLog.info("product analytics event dispatched", {
      event_name: eventName,
    });
  });
  window.addEventListener("posthog:reset", () => {
    posthog.reset();
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
