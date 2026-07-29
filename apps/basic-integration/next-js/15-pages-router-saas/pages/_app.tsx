import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import posthog from 'posthog-js';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentifier() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);
  const identifiedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (user && identifiedUserId.current !== user.id) {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name || undefined,
        role: user.role
      });
      identifiedUserId.current = user.id;
    }

    if (!user && identifiedUserId.current !== null) {
      posthog.reset();
      identifiedUserId.current = null;
    }
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
        <PostHogUserIdentifier />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
