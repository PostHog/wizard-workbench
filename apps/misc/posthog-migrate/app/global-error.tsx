"use client";

import { ThemeProvider } from "@/components/theme-provider";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh items-center justify-center bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <div className="space-y-4 text-center">
            <h2 className="font-bold text-2xl">Something went wrong</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{error.message}</p>
            <button
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={reset}
            >
              Try again
            </button>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
