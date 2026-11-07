export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const {
    posthogLoggerProvider,
    posthogLogsMissingConfigurationMessage,
  } = await import('@/lib/posthog-logs');

  if (
    !posthogLoggerProvider &&
    posthogLogsMissingConfigurationMessage &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.warn(posthogLogsMissingConfigurationMessage);
  }
}
