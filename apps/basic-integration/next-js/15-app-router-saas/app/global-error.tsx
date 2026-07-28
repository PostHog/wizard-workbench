'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
