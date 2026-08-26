import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import dynamic from 'next/dynamic';
import { SWRConfig } from 'swr';

const PostHogInit = dynamic(() => import('@/components/PostHogInit'), {
  ssr: false
});

const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <PostHogInit />
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
