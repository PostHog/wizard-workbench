import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUserIdentification() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!user) {
      return;
    }

    const distinctId = user.id.toString();

    if (posthog.get_distinct_id() !== distinctId) {
      posthog.identify(distinctId, {
        email: user.email,
        name: user.name ?? undefined,
        role: user.role
      });
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
        <PostHogUserIdentification />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
