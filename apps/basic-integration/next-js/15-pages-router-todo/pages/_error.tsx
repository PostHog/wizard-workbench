import type { NextPageContext } from 'next';
import NextError, { type ErrorProps } from 'next/error';
import { useEffect } from 'react';

type PostHogErrorProps = ErrorProps & {
  err?: Error;
};

export default function GlobalError({ statusCode, err }: PostHogErrorProps) {
  useEffect(() => {
    if (!err) return;

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.captureException(err);
    });
  }, [err]);

  return <NextError statusCode={statusCode} />;
}

GlobalError.getInitialProps = ({ res, err }: NextPageContext): PostHogErrorProps => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 404,
  err: err ?? undefined,
});
