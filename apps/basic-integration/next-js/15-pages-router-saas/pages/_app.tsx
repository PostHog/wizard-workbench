import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import posthog from 'posthog-js';

const manrope = Manrope({ subsets: ['latin'] });

if (typeof window !== 'undefined') {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.error(
        new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        )
      );
    }
  } else {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-01-30',
      tracing_headers: [window.location.hostname],
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false
      }
    });
  }
}

type IdentifiedUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

export default function App({ Component, pageProps }: AppProps) {
  const user = pageProps.fallback?.['/api/user'] as IdentifiedUser | null | undefined;

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    async function identifyCurrentUser() {
      const currentUser =
        user ??
        (await fetch('/api/user').then((response) =>
          response.ok ? response.json() : null
        ));

      if (!currentUser || typeof currentUser.id !== 'number') {
        return;
      }

      posthog.identify(String(currentUser.id), {
        email: currentUser.email,
        role: currentUser.role,
        ...(currentUser.name ? { name: currentUser.name } : {})
      });
    }

    void identifyCurrentUser();
  }, []);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
