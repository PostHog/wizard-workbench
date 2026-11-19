import { Component, type ErrorInfo, type ReactNode } from 'react';
import NextError from 'next/error';
import posthog from 'posthog-js';

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
    posthog.captureException(error, {
      component_stack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <NextError statusCode={500} />;
    }

    return this.props.children;
  }
}
