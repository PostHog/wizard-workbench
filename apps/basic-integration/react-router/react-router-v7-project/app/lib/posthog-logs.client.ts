import posthog, { isPostHogConfigured } from "~/lib/posthog.client";

type CountryAction = "country_claimed" | "country_liked" | "country_visited";

export const posthogLogger = {
  countryCatalogLoaded(countryCount: number) {
    if (isPostHogConfigured) {
      posthog.logger.info("country catalog loaded", { country_count: countryCount });
    }
  },

  countryCatalogLoadFailed(failureKind: "api_response" | "network_request") {
    if (isPostHogConfigured) {
      posthog.logger.warn("country catalog load failed", { failure_kind: failureKind });
    }
  },

  countryActionCompleted(action: CountryAction, countryCode: string) {
    if (isPostHogConfigured) {
      posthog.logger.info("country action completed", {
        action,
        country_code: countryCode,
      });
    }
  },
};
