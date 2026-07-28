import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';

interface ErrorPageProps {
  statusCode: number;
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

async function captureServerException(error: unknown): Promise<void> {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (typeof window !== 'undefined' || !projectToken || !host || !isError(error)) {
    return;
  }

  const { PostHog } = eval('require')('posthog-node') as typeof import('posthog-node');
  const posthog = new PostHog(projectToken, {
    host,
    flushAt: 1,
    flushInterval: 0,
    enableExceptionAutocapture: true,
  });

  posthog.captureException(error);
  await posthog.shutdown();
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return <NextErrorComponent statusCode={statusCode} />;
}

ErrorPage.getInitialProps = async (context: NextPageContext): Promise<ErrorPageProps> => {
  await captureServerException(context.err);

  const errorInitialProps = await NextErrorComponent.getInitialProps(context);
  return { statusCode: errorInitialProps.statusCode };
};
