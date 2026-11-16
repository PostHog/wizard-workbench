import { usePostHog } from "@posthog/react";

type EventProperties = Record<string, boolean | number | string>;

export function usePostHogCapture() {
  const posthog = usePostHog();

  return (event: string, properties?: EventProperties) => {
    if (
      !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    posthog.capture(event, properties);
  };
}
