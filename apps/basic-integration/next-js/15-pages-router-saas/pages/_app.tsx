import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import ErrorBoundary from '@/components/error-boundary';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentity() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);
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

    posthog.identify(userId, {
      email: user.email,
      role: user.role,
      ...(user.name ? { name: user.name } : {})
    });
    identifiedUserId.current = userId;
  }, [user]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <PostHogUserIdentity />
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SWRConfig>
    </div>
  );
}
