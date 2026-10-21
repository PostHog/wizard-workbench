import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_exceptions: true,
    });
  } else if (process.env.NODE_ENV === 'development') {
    const missingVariable = posthogKey
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_KEY';
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    async function identifyAuthenticatedUser() {
      const response = await fetch('/api/user');
      if (!response.ok) return;

      const user = await response.json();
      if (!user || typeof user.id !== 'number') return;

      posthog.identify(String(user.id), {
        email: user.email,
        ...(user.name ? { name: user.name } : {}),
        role: user.role
      });
    }

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      void identifyAuthenticatedUser();
    }
  }, []);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SWRConfig>
    </div>
  );
}
