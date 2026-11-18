function isPostHogConfigured() {
  return Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  );
}

async function getPostHogLogger() {
  const { default: posthog } = await import("posthog-js");
  return posthog.logger;
}

export function logCountryCatalogLoaded(countryCount: number) {
  if (!isPostHogConfigured()) return;

  void getPostHogLogger()
    .then((posthogLogger) => {
      posthogLogger.info("country catalog loaded", {
        event: "country_catalog_loaded",
        country_count: countryCount,
      });
    })
    .catch(() => {});
}

export function logCountryCatalogUnavailable() {
  if (!isPostHogConfigured()) return;

  void getPostHogLogger()
    .then((posthogLogger) => {
      posthogLogger.warn("country catalog unavailable", {
        event: "country_catalog_unavailable",
      });
    })
    .catch(() => {});
}
