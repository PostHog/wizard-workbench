require "posthog"

# One PostHog client for the process. Reads the project token and host from
# the environment; without a token it stays disabled so the app still boots.
module Analytics
  def self.client
    @client ||= begin
      api_key = ENV["POSTHOG_API_KEY"]
      if api_key.nil? || api_key.empty?
        if ENV.fetch("RACK_ENV", "development") == "development"
          raise "POSTHOG_API_KEY variable required by PostHog is missing or un-configured, " \
                "this causes events to be silently missed. This error stops appearing once " \
                "POSTHOG_API_KEY is configured"
        end
        nil
      else
        PostHog::Client.new(
          api_key: api_key,
          host: ENV.fetch("POSTHOG_HOST", "https://us.i.posthog.com")
        )
      end
    end
  end

  def self.capture(**args)
    client&.capture(**args)
  end

  def self.shutdown
    client&.shutdown
  end
end

at_exit { Analytics.shutdown }
