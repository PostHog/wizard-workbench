import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  defaults: '2026-01-30',
  // Recording was switched off while the shop iterated on its cookie banner.
  // The replay-vision wizard run is expected to remove this override.
  disable_session_recording: true,
})
