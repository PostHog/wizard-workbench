import posthog from 'posthog-js';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (typeof window !== 'undefined' && posthogKey && posthogHost && !posthog.__loaded) {
  posthog.init(posthogKey, {
    api_host: '/ingest',
    ui_host: posthogHost,
    defaults: '2026-05-30',
    capture_pageview: 'history_change',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development'
  });
}
