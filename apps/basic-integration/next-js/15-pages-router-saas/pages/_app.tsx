import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Manrope } from 'next/font/google';
import posthog from 'posthog-js';
import { SWRConfig } from 'swr';

const manrope = Manrope({ subsets: ['latin'] });
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== 'undefined') {
  if (!posthogKey) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
  } else if (!posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
  } else {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: '2026-01-30',
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
