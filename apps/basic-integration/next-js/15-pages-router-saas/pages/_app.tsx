import ErrorBoundary from '@/components/error-boundary';
import '@/styles/globals.css';
import type { User } from '@/lib/db/schema';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentification() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);
  const identifiedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    if (!user) {
      if (identifiedUserId.current !== null) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    const userId = String(user.id);

    if (
      identifiedUserId.current === user.id ||
      posthog.get_distinct_id() === userId
    ) {
      identifiedUserId.current = user.id;
      return;
    }

    if (identifiedUserId.current !== null) {
      posthog.reset();
    }

    posthog.identify(userId, {
      email: user.email,
      role: user.role,
      ...(user.name ? { name: user.name } : {})
    });
    identifiedUserId.current = user.id;
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
