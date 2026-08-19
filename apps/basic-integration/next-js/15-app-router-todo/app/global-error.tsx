'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    if (isPostHogConfigured) {
      posthog.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main>
          <h1>Something went wrong</h1>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
