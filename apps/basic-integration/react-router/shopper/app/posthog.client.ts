let posthogPromise: Promise<typeof import("posthog-js").default | undefined> | undefined;

export function getPostHog() {
  if (typeof window === "undefined") {
    return Promise.resolve(undefined);
  }

  const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
      );
    }

    return Promise.resolve(undefined);
  }

  if (!posthogPromise) {
    posthogPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(token, {
          api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
          defaults: "2026-08-30",
          logs: {
            serviceName: "shopper-web",
            environment: import.meta.env.MODE,
          },
          capture_exceptions: {
            capture_unhandled_errors: true,
            capture_unhandled_rejections: true,
            capture_console_errors: false,
          },
        });

        return posthog;
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error("PostHog initialization failed.", error);
        }
        return undefined;
      });
  }

  return posthogPromise;
}
