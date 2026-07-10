import posthog from 'posthog-js';

export function getPostHogRequestHeaders() {
  return {
    'X-POSTHOG-DISTINCT-ID': posthog.get_distinct_id(),
    'X-POSTHOG-SESSION-ID': posthog.get_session_id(),
  };
}
