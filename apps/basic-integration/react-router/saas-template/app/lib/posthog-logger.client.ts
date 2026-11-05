import { isPostHogEnabled, posthog } from "./posthog.client";

type AuthenticationMethod = "email";

export const posthogLogger = {
  appHydrationStarted() {
    if (isPostHogEnabled) {
      posthog.logger.info("app_hydration_started");
    }
  },
  authenticationRequested(method: AuthenticationMethod) {
    if (isPostHogEnabled) {
      posthog.logger.info("authentication_requested", {
        authentication_method: method,
      });
    }
  },
  registrationRequested(method: AuthenticationMethod) {
    if (isPostHogEnabled) {
      posthog.logger.info("registration_requested", {
        authentication_method: method,
      });
    }
  },
};
