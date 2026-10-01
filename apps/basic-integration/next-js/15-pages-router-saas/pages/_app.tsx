import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import ErrorBoundary from '@/components/error-boundary';

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

const manrope = Manrope({ subsets: ['latin'] });

if (typeof window !== 'undefined') {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (projectToken && host) {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-01-30',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development'
    });
  } else if (process.env.NODE_ENV === 'development') {
    const missingVariable = projectToken
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
    console.error(
      new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    );
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let isMounted = true;

    async function identifyAuthenticatedUser() {
      const response = await fetch('/api/user');
      if (!response.ok) return;

      const user = (await response.json()) as AuthenticatedUser | null;
      if (!isMounted || !user || typeof user.id !== 'number') return;

      posthog.identify(String(user.id), {
        email: user.email,
        ...(user.name ? { name: user.name } : {}),
        role: user.role
      });
    }

    void identifyAuthenticatedUser();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={manrope.className}>
      <ErrorBoundary>
        <SWRConfig
          value={{
            fallback: pageProps.fallback || {}
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
