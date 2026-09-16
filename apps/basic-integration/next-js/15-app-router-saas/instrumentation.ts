export function register() {}

export const onRequestError = async (
  error: unknown,
  request: { headers: Record<string, string | string[] | undefined> },
) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { getPostHogServer } = await import('./lib/posthog-server');
  const posthog = getPostHogServer();

  if (!posthog) {
    return;
  }

  const cookieHeader = request.headers.cookie;
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join('; ')
    : cookieHeader;
  let distinctId: string | undefined;

  if (cookieString) {
    const posthogCookie = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/)?.[1];

    if (posthogCookie) {
      try {
        const posthogData = JSON.parse(decodeURIComponent(posthogCookie)) as {
          distinct_id?: string;
        };
        distinctId = posthogData.distinct_id;
      } catch {
        // Ignore malformed analytics cookies and capture the exception anonymously.
      }
    }
  }

  await posthog.captureException(error, distinctId);
  await posthog.flush();
};
