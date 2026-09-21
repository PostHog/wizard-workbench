import { Component as ReactComponent, type ErrorInfo, type ReactNode } from 'react';
import type { AppProps } from 'next/app';
import posthog from 'posthog-js';
import '@/styles/globals.css';

const posthogProjectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== 'undefined') {
  if (posthogProjectToken && posthogHost) {
    posthog.init(posthogProjectToken, {
      api_host: posthogHost,
      defaults: '2026-01-30',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    });
  } else if (process.env.NODE_ENV === 'development') {
    const missingVariable = posthogProjectToken
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN';

    console.error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

class ErrorBoundary extends ReactComponent<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (posthogProjectToken && posthogHost) {
      posthog.captureException(error, {
        $exception_list: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong.</p>;
    }

    return this.props.children;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
