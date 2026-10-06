import { useEffect } from 'react';

export function PostHogInitializer() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!token || !host) {
      if (process.env.NODE_ENV === 'development') {
        const missingVariable = token
          ? 'NEXT_PUBLIC_POSTHOG_HOST'
          : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

        throw new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        );
      }

      return;
    }

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(token, {
        api_host: host,
        defaults: '2026-01-30',
        capture_exceptions: true,
        debug: process.env.NODE_ENV === 'development'
      });
      (window as Window & { posthogInitialized?: boolean }).posthogInitialized = true;
      window.dispatchEvent(new Event('posthog_initialized'));
    });
  }, []);

  return null;
}
