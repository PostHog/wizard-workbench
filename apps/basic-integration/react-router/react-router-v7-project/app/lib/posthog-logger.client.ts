import { usePostHog } from "@posthog/react";

type LogAttributes = Record<string, string | number | boolean>;

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

export function usePostHogLogger() {
  const posthog = usePostHog();

  return {
    info(message: string, attributes: LogAttributes) {
      if (!isPostHogConfigured) return;

      posthog.logger.info(message, attributes);
    },
  };
}
