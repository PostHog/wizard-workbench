import type { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'
import { useEffect } from 'react'

interface ErrorPageProps {
  statusCode: number
  error?: { message?: string; name?: string; stack?: string }
}

export default function ErrorPage({ statusCode, error }: ErrorPageProps) {
  useEffect(() => {
    if (error) {
      void import('posthog-js').then(({ default: posthog }) => {
        posthog.captureException(error)
      })
    }
  }, [error])

  return <NextErrorComponent statusCode={statusCode} />
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return {
    statusCode,
    error: err
      ? {
          message: err.message,
          name: err.name,
          stack: err.stack,
        }
      : undefined,
  }
}
