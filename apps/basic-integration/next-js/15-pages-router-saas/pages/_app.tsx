import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import type { ErrorInfo, ReactNode } from 'react';
import { Component as ReactComponent } from 'react';
import posthog from 'posthog-js';
import { SWRConfig } from 'swr';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });

class PostHogIdentify extends ReactComponent<{ user?: User | null }> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.identify(user);
      return;
    }

    void fetch('/api/user')
      .then((response) => (response.ok ? response.json() : null))
      .then((currentUser: User | null) => {
        if (currentUser) {
          this.identify(currentUser);
        }
      })
      .catch(() => undefined);
  }

  identify(user: User) {
    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name || undefined,
      role: user.role
    });
  }

  render() {
    return null;
  }
}

class PostHogErrorBoundary extends ReactComponent<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    posthog.captureException(error, {
      component_stack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh the page and try again.</p>;
    }

    return this.props.children;
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
        <PostHogErrorBoundary>
          <PostHogIdentify user={pageProps.fallback?.['/api/user']} />
          <Component {...pageProps} />
        </PostHogErrorBoundary>
      </SWRConfig>
    </div>
  );
}
