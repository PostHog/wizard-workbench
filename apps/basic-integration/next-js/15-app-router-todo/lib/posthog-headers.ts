import posthog from 'posthog-js';

export function getPostHogHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    'X-POSTHOG-DISTINCT-ID': posthog.get_distinct_id(),
    'X-POSTHOG-SESSION-ID': posthog.get_session_id(),
  } satisfies Record<string, string>;
}
