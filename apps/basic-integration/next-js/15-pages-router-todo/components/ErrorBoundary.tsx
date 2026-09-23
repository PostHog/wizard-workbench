import { Component, type ErrorInfo, type ReactNode } from 'react';
import posthog from 'posthog-js';

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isPostHogConfigured) {
      posthog.captureException(error, {
        component_stack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh the page and try again.</p>;
    }

    return this.props.children;
  }
}
