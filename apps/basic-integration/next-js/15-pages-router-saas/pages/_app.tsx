import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { ErrorBoundary } from '@/components/error-boundary';
import { PostHogInitializer } from '@/components/posthog-initializer';

const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <PostHogInitializer />
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
