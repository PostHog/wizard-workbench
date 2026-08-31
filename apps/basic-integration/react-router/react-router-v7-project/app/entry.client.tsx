import { startTransition, StrictMode } from "react";
import posthog from "posthog-js";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

type PostHogUser = {
  id: string;
  username: string;
  email: string;
};

window.addEventListener("posthog_identify_user", (event: Event) => {
  const user = (event as CustomEvent<PostHogUser>).detail;

  posthog?.identify(user.id, {
    email: user.email,
    username: user.username,
  });
});

window.addEventListener("posthog_reset_user", () => {
  posthog?.reset();
});

const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (projectToken && apiHost) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
} else if (import.meta.env.DEV) {
  const missingVariable = !projectToken
    ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
    : "VITE_PUBLIC_POSTHOG_HOST";

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
