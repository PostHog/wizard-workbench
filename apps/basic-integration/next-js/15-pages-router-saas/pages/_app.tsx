import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import useSWR from 'swr';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function IdentifyCurrentUser() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!user || posthog.get_distinct_id() === String(user.id)) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
      role: user.role
    });
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
          <IdentifyCurrentUser />
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
