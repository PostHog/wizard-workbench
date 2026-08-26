import type { AppProps } from 'next/app';
import posthog from 'posthog-js';
import '@/styles/globals.css';

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogToken || !posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      `${!posthogToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${!posthogToken ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'NEXT_PUBLIC_POSTHOG_HOST'} is configured`,
    );
  }
} else {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
