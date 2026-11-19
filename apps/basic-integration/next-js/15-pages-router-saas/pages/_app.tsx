import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import type { User } from '@/lib/db/schema';
import ErrorBoundary from '@/components/error-boundary';

const manrope = Manrope({ subsets: ['latin'] });

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentification() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!user) return;

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.identify(String(user.id), {
        email: user.email,
        ...(user.name ? { name: user.name } : {}),
        role: user.role
      });
    });
  }, [user?.id, user?.email, user?.name, user?.role]);

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
