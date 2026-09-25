import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/error-boundary';
import { SWRConfig } from 'swr';

const PostHogInit = dynamic(
  () => import('@/components/posthog-init').then((module) => module.PostHogInit),
  { ssr: false }
);
const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <PostHogInit />
      <ErrorBoundary>
        <SWRConfig
          value={{
            fallback: pageProps.fallback || {}
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ErrorBoundary>
    </div>
  );
}
