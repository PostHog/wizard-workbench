import posthog from 'posthog-js';

export function getPostHogCorrelationHeaders() {
  const distinctId = posthog.get_distinct_id();
  const sessionId = posthog.get_session_id();

  return {
    'X-POSTHOG-DISTINCT-ID': distinctId,
    ...(sessionId ? { 'X-POSTHOG-SESSION-ID': sessionId } : {})
  };
}
