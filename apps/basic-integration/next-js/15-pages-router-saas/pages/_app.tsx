import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import posthog from 'posthog-js';
import { SWRConfig } from 'swr';

const manrope = Manrope({ subsets: ['latin'] });
const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== 'undefined') {
  if (!projectToken || !posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      const missingVariable = projectToken
        ? 'NEXT_PUBLIC_POSTHOG_HOST'
        : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
  } else {
    posthog.init(projectToken, {
      api_host: posthogHost,
      defaults: '2026-01-30',
      capture_exceptions: true,
      tracing_headers: [window.location.hostname],
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
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
