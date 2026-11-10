import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentifier() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);

  useEffect(() => {
    if (!user) return;

    posthog.identify(user.id.toString(), {
      email: user.email,
      name: user.name || undefined,
      role: user.role
    });
  }, [user?.id]);

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
          <PostHogIdentifier />
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
