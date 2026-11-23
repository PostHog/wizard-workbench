import { PostHog } from "posthog-node";

let client: PostHog | undefined;

export function analytics(): PostHog {
  client ??= new PostHog(process.env.VITE_POSTHOG_KEY ?? "", {
    host: process.env.VITE_POSTHOG_HOST,
  });
  return client;
}
