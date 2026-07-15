import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import useSWR from 'swr';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentify() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user?.id) {
      posthog.identify(String(user.id), {
        role: user.role,
      });
    }
  }, [user?.id]);

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
        <PostHogIdentify />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
