/// <reference types="astro/client" />

interface Window {
  posthog?: {
    capture(event: string, properties?: Record<string, unknown>): void;
    identify(distinctId: string, properties?: Record<string, unknown>): void;
    get_session_id?: () => string;
    get_distinct_id?: () => string;
    captureException?(error: unknown): void;
    reset?(): void;
  };
}
