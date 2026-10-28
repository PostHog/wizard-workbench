import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { useEffect, useState, type ReactNode } from "react";
import type { PostHog } from "posthog-js";

let posthogClient: PostHog | null = null;
let initializationStarted = false;

export default function PostHogClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client, setClient] = useState<PostHog | null>(posthogClient);

  useEffect(() => {
    const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

    if (!token || !host) {
      if (import.meta.env.DEV) {
        if (!token) {
          console.error(
            new Error(
              "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
            )
          );
        }

        if (!host) {
          console.error(
            new Error(
              "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured"
            )
          );
        }
      }

      return;
    }

    if (posthogClient) {
      setClient(posthogClient);
      return;
    }

    if (initializationStarted) return;
    initializationStarted = true;

    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: "2026-08-30",
        logs: {
          serviceName: "shopper-web",
          environment: import.meta.env.MODE,
        },
      });
      posthogClient = posthog;
      setClient(posthog);
    });
  }, []);

  if (!client) return <>{children}</>;

  return (
    <PostHogProvider client={client}>
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  );
}
