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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    posthog.captureException(error, {
      component_stack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
