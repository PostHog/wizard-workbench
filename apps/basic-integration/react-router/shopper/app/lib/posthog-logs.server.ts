import { PostHog } from "posthog-node";

const projectToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST;

let posthogLogger: PostHog["logger"] | undefined;

if (projectToken && posthogHost) {
  const posthog = new PostHog(projectToken, {
    host: posthogHost,
    enableExceptionAutocapture: true,
    logs: {
      serviceName: "shopper-react-router",
    },
  });

  posthogLogger = posthog.logger;
} else if (process.env.NODE_ENV !== "production") {
  const missingVariable = projectToken
    ? "VITE_PUBLIC_POSTHOG_HOST"
    : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";

  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

export function getPostHogLogger() {
  return posthogLogger;
}
