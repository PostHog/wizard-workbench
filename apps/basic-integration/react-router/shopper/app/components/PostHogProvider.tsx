import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { PostHog } from "posthog-js";

type PostHogProviderProps = {
  children: ReactNode;
};

type PostHogContextProvider = ComponentType<{
  children: ReactNode;
  client: PostHog;
}>;

let posthogClientPromise: Promise<{
  client: PostHog;
  Provider: PostHogContextProvider;
}> | undefined;

function initializePostHog() {
  const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!projectToken) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      );
    }

    return undefined;
  }

  if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
      );
    }

    return undefined;
  }

  posthogClientPromise ??= Promise.all([
    import("@posthog/react"),
    import("posthog-js"),
  ]).then(([{ PostHogProvider }, { default: posthog }]) => {
    posthog.init(projectToken, {
      api_host: host,
      capture_exceptions: {
        capture_console_errors: false,
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
      },
      defaults: "2026-01-30",
      logs: {
        serviceName: "shopper-web",
        environment: import.meta.env.MODE,
      },
    });

    return { client: posthog, Provider: PostHogProvider };
  });

  return posthogClientPromise;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const [client, setClient] = useState<PostHog>();
  const [Provider, setProvider] = useState<PostHogContextProvider>();

  useEffect(() => {
    let cancelled = false;
    const initialization = initializePostHog();

    initialization?.then(({ client, Provider }) => {
      if (!cancelled) {
        setClient(client);
        setProvider(() => Provider);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!client || !Provider) {
    return <>{children}</>;
  }

  return <Provider client={client}>{children}</Provider>;
}
