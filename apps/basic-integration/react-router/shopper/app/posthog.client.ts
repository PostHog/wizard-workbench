const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

let client: typeof import("posthog-js").default | undefined;
let initialization: Promise<void> | undefined;

if (typeof window !== "undefined") {
  if (!token || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = !token
        ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "VITE_PUBLIC_POSTHOG_HOST";
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
  } else {
    initialization = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: "2026-01-30",
      });
      client = posthog;
    });
  }
}

const posthog = {
  capture(event: string, properties?: Record<string, unknown>) {
    void initialization?.then(() => client?.capture(event, properties));
  },
  captureException(error: Error) {
    void initialization?.then(() => client?.captureException(error));
  },
};

export default posthog;
