import { PostHog } from "posthog-node";

let hasWarnedAboutMissingPostHogKey = false;
let posthogLogsClient: PostHog | undefined;

function getPostHogLogger() {
  const apiKey = process.env.VITE_POSTHOG_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" && !hasWarnedAboutMissingPostHogKey) {
      console.warn(
        "VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured",
      );
      hasWarnedAboutMissingPostHogKey = true;
    }
    return;
  }

  try {
    posthogLogsClient ??= new PostHog(apiKey, {
      host: process.env.VITE_POSTHOG_HOST,
      logs: { serviceName: "saas-template" },
    });

    return posthogLogsClient.logger;
  } catch {
    // Log delivery must not interrupt the application's work.
    return;
  }
}

export function logServerOperation(
  message: string,
  attributes: Record<string, boolean | number | string>,
) {
  try {
    getPostHogLogger()?.info(message, attributes);
  } catch {
    // Log delivery must not interrupt the application's work.
  }
}
