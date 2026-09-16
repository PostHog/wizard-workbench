import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog, { isPostHogConfigured } from "~/lib/posthog.client";
import { getCurrentUser, type FakeUser } from "~/lib/utils/auth";

function identifyUser(user: FakeUser) {
  posthog.identify(user.id, {
    email: user.email,
    username: user.username,
  });
}

if (isPostHogConfigured) {
  window.addEventListener("posthog:identify_user", (event) => {
    identifyUser((event as CustomEvent<FakeUser>).detail);
  });
  window.addEventListener("posthog:reset_user", () => {
    posthog.reset();
  });
  window.addEventListener("posthog:capture", (event) => {
    const { eventName, properties } = (
      event as CustomEvent<{
        eventName: string;
        properties?: Record<string, unknown>;
      }>
    ).detail;
    posthog.capture(eventName, properties);
  });

  const currentUser = getCurrentUser();
  if (currentUser) {
    identifyUser(currentUser);
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
