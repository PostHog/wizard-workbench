import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { User } from '@/lib/db/schema';
import posthog from 'posthog-js';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function AnalyticsIdentity() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user) {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name,
        role: user.role
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
        <AnalyticsIdentity />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
