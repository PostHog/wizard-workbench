import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_artisan_checkout_placeholder', {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  // Recording was switched off while the shop iterated on its cookie banner.
  // The replay-vision wizard run is expected to remove this override.
  disable_session_recording: true,
})
