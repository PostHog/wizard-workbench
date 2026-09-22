import { Component, type ErrorInfo, type ReactNode } from 'react';
import posthog from 'posthog-js';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    posthog.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh the page and try again.</p>;
    }

    return this.props.children;
  }
}
