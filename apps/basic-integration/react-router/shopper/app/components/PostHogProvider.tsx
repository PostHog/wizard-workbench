import { useEffect, useState, type ComponentType, type ReactNode } from "react";

type Provider = ComponentType<{ client: unknown; children: ReactNode }>;
type ErrorBoundary = ComponentType<{ children: ReactNode }>;

let posthogProviderPromise: Promise<{
  client: unknown;
  Provider: Provider;
  ErrorBoundary: ErrorBoundary;
}> | null = null;

function loadPostHog() {
  if (!posthogProviderPromise) {
    const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

    if (!projectToken || !host) {
      const missingVariable = projectToken
        ? "VITE_PUBLIC_POSTHOG_HOST"
        : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";

      if (import.meta.env.DEV) {
        throw new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        );
      }

      return null;
    }

    posthogProviderPromise = Promise.all([
      import("posthog-js"),
      import("@posthog/react"),
    ]).then(([{ default: posthog }, { PostHogErrorBoundary, PostHogProvider }]) => {
      posthog.init(projectToken, {
        api_host: host,
        defaults: "2026-05-30",
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
      });

      return {
        client: posthog,
        Provider: PostHogProvider as Provider,
        ErrorBoundary: PostHogErrorBoundary as ErrorBoundary,
      };
    });
  }

  return posthogProviderPromise;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  const [posthog, setPostHog] = useState<{
    client: unknown;
    Provider: Provider;
    ErrorBoundary: ErrorBoundary;
  } | null>(null);

  useEffect(() => {
    loadPostHog()?.then(setPostHog);
  }, []);

  if (!posthog) {
    return <>{children}</>;
  }

  const { ErrorBoundary, Provider } = posthog;
  return (
    <Provider client={posthog.client}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  );
}
