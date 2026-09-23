import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== 'undefined') {
  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = posthogKey
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_KEY';

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
  } else {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: '2026-01-30',
      tracing_headers: [window.location.hostname],
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development'
    });
  }
}

export default function App({ Component, pageProps }: AppProps) {
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
