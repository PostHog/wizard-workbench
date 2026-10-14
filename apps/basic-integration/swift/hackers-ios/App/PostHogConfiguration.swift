//
//  PostHogConfiguration.swift
//  Hackers
//

import Foundation
import PostHog

enum PostHogConfiguration {
    static private(set) var isConfigured = false

    static func setup() {
        guard let projectToken = configuredValue(for: "PostHogProjectToken", environmentKey: "POSTHOG_PROJECT_TOKEN") else {
            return
        }
        guard let host = configuredValue(for: "PostHogHost", environmentKey: "POSTHOG_HOST") else {
            return
        }

        let config = PostHogConfig(projectToken: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        config.logs.serviceName = "hackers-ios"
        PostHogSDK.shared.setup(config)
        isConfigured = true
        PostHogLog.info("app_started")
    }

    private static func configuredValue(for infoDictionaryKey: String, environmentKey: String) -> String? {
        guard let value = Bundle.main.object(forInfoDictionaryKey: infoDictionaryKey) as? String,
              !value.isEmpty,
              !value.hasPrefix("$(")
        else {
#if DEBUG
            assertionFailure("\(environmentKey) variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once \(environmentKey) is configured")
#endif
            return nil
        }

        return value
    }
}

enum PostHogLog {
    static func info(_ message: String) {
        guard PostHogConfiguration.isConfigured else { return }
        PostHogSDK.shared.logger?.info(message)
    }
}
