import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';
import type { User } from '@/lib/db/schema';
import ErrorBoundary from '@/components/ErrorBoundary';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
);

function PostHogUserIdentification() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);
  const identifiedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (
      !isPostHogConfigured ||
      !user ||
      identifiedUserId.current === user.id
    ) {
      return;
    }

    identifiedUserId.current = user.id;
    void import('posthog-js').then(({ default: posthog }) => {
      if (posthog.get_distinct_id() === String(user.id)) {
        return;
      }

      posthog.identify(String(user.id), {
        email: user.email,
        ...(user.name ? { name: user.name } : {}),
        role: user.role
      });
    });
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
        <PostHogUserIdentification />
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SWRConfig>
    </div>
  );
}
