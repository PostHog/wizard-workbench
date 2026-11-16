import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST
);

function PostHogIdentity() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!isPostHogConfigured || !user) {
      return;
    }

    const distinctId = String(user.id);

    void import('posthog-js')
      .then(({ default: posthog }) => {
        if (posthog.get_distinct_id() === distinctId) {
          return;
        }

        posthog.identify(distinctId, {
          email: user.email,
          name: user.name || undefined,
          role: user.role
        });
      })
      .catch(() => {});
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
        <PostHogIdentity />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
