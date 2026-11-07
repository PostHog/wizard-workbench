import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import ErrorBoundary from '@/components/ErrorBoundary';

const manrope = Manrope({ subsets: ['latin'] });

type AuthenticatedUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    let cancelled = false;

    async function identifyAuthenticatedUser() {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) return;

        const user = (await response.json()) as AuthenticatedUser | null;
        if (!user || typeof user.id !== 'number') return;

        const { default: posthog } = await import('posthog-js');
        if (!cancelled) {
          posthog.identify(String(user.id), {
            email: user.email,
            name: user.name ?? undefined,
            role: user.role
          });
        }
      } catch {}
    }

    void identifyAuthenticatedUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={manrope.className}>
      <ErrorBoundary>
        <SWRConfig
          value={{
            fallback: pageProps.fallback || {}
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
