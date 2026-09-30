import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { useEffect, type ErrorInfo } from 'react';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });
type PostHog = typeof import('posthog-js').default;
let posthogInitialization: Promise<PostHog | null> | null = null;

function initializePostHog() {
  if (posthogInitialization) return posthogInitialization;

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = !projectToken
        ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    posthogInitialization = Promise.resolve(null);
    return posthogInitialization;
  }

  posthogInitialization = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-01-30',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development'
    });
    return posthog;
  });

  return posthogInitialization;
}

function captureException(error: Error, errorInfo: ErrorInfo) {
  void initializePostHog().then((posthog) => {
    posthog?.captureException(error, {
      component_stack: errorInfo.componentStack
    });
  });
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    void initializePostHog()
      .then(async (posthog) => {
        if (!posthog) return;

        const response = await fetch('/api/user');
        const user = response.ok ? await response.json() : null;
        if (!user?.id) return;

        posthog.identify(String(user.id), {
          email: user.email,
          name: user.name || undefined,
          role: user.role
        });
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <ErrorBoundary captureException={captureException}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SWRConfig>
    </div>
  );
}
