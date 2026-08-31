import type { PostHog } from "posthog-js";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_POSTHOG_HOST;

let client: PostHog | undefined;
let initialization: Promise<PostHog | undefined> | undefined;

export function initializePostHog(): Promise<PostHog | undefined> {
  if (client) return Promise.resolve(client);
  if (initialization) return initialization;

  initialization = createPostHogClient();

  return initialization;
}

async function createPostHogClient(): Promise<PostHog | undefined> {
  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      throw new Error(
        `${!projectToken ? "VITE_POSTHOG_PROJECT_TOKEN" : "VITE_POSTHOG_HOST"} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!projectToken ? "VITE_POSTHOG_PROJECT_TOKEN" : "VITE_POSTHOG_HOST"} is configured`,
      );
    }

    return undefined;
  }

  const { default: posthog } = await import("posthog-js");

  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });

  client = posthog;

  return client;
}

export async function capturePostHogEvent(
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  if (typeof window === "undefined") return;

  const posthog = await initializePostHog();
  posthog?.capture(event, properties);
}

export async function capturePostHogException(error: unknown): Promise<void> {
  if (typeof window === "undefined") return;

  const posthog = await initializePostHog();
  posthog?.captureException(error);
}
