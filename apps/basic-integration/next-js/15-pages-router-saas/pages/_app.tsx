import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import posthog from 'posthog-js';
import ErrorBoundary from '@/components/ErrorBoundary';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentification() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    const userId = String(user.id);
    if (identifiedUserId.current === userId) {
      return;
    }

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(userId, {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
      role: user.role
    });
    identifiedUserId.current = userId;
  }, [user]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <ErrorBoundary>
        <SWRConfig
          value={{
            fallback: pageProps.fallback || {}
          }}
        >
          <PostHogUserIdentification />
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
