import { PostHog } from "posthog-node";

export function createPostHogClient() {
  return new PostHog(
    // biome-ignore lint/style/noNonNullAssertion: Required env var
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN!,
    {
      flushAt: 1,
      flushInterval: 0,
      // biome-ignore lint/style/noNonNullAssertion: Required env var
      host: process.env.VITE_PUBLIC_POSTHOG_HOST!,
    },
  );
}
