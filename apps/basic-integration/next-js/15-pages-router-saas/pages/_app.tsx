import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogUser() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (user?.id) {
      posthog.identify(String(user.id), {
        name: user.name,
        role: user.role,
      });
    }
  }, [user?.id]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => posthog.capture('$pageview');
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <PostHogUser />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
