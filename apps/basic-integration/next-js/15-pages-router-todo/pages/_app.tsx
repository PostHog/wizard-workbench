import { Component as ReactComponent, type ErrorInfo, type ReactNode } from 'react';
import type { AppProps } from 'next/app';
import posthog from 'posthog-js';
import '@/styles/globals.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends ReactComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error, { errorInfo });
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
    <ErrorBoundary key={Component.displayName || Component.name}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
