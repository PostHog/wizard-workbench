import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import { useEffect } from 'react';
import posthog from 'posthog-js';

type ErrorProps = {
  statusCode?: number;
};

export default function GlobalError({ statusCode }: ErrorProps) {
  useEffect(() => {
    if ((statusCode ?? 500) >= 500) {
      const error = new Error(`Next.js error boundary rendered with status ${statusCode ?? 500}`);
      posthog.captureException(error);
    }
  }, [statusCode]);

  return <NextErrorComponent statusCode={statusCode ?? 500} />;
}

GlobalError.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 500,
});
