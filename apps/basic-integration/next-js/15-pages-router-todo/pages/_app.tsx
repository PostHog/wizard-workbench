import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { AppProps } from 'next/app';
import posthog from 'posthog-js';
import '@/styles/globals.css';

class PostHogErrorBoundary extends Component<{ children: ReactNode }> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    posthog.captureException(error, {
      component_stack: errorInfo.componentStack,
    });
  }

  render() {
    return this.props.children;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PostHogErrorBoundary>
      <Component {...pageProps} />
    </PostHogErrorBoundary>
  );
}
