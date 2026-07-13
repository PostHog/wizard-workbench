import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { PostHogUserIdentify } from '@/components/posthog-user-identify';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const fallback = pageProps.fallback || {};
  const user = (fallback['/api/user'] as User | null | undefined) ?? null;

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback
        }}
      >
        <PostHogUserIdentify user={user} />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
