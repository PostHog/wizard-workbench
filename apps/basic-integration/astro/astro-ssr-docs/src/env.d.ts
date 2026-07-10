interface Window {
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
    captureException?: (error: unknown, properties?: Record<string, unknown>) => void;
    identify: (distinctId: string, properties?: Record<string, unknown>) => void;
    get_distinct_id?: () => string | null;
    get_session_id?: () => string | null;
    reset?: () => void;
  };
}
