PostHog.init(
  api_key: ENV.fetch("POSTHOG_API_KEY"),
  host: ENV.fetch("POSTHOG_HOST")
)
