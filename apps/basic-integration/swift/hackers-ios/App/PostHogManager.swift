import Foundation
import PostHog

enum PostHogManager {
    static func setup() {
        guard let token = ProcessInfo.processInfo.environment["POSTHOG_PROJECT_TOKEN"], !token.isEmpty else {
            #if DEBUG
            fatalError("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #else
            return
            #endif
        }
        guard let host = ProcessInfo.processInfo.environment["POSTHOG_HOST"], !host.isEmpty else {
            #if DEBUG
            fatalError("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #else
            return
            #endif
        }
        let config = PostHogConfig(apiKey: token, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }
}
