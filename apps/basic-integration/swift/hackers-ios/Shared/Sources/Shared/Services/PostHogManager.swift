//
//  PostHogManager.swift
//  Shared
//
//  Provides centralized PostHog analytics initialization and configuration.
//

import Foundation
import PostHog

public final class PostHogManager {
    public static let shared = PostHogManager()

    private var isInitialized = false

    private init() {}

    public func initialize() {
        guard !isInitialized else { return }

        let apiKey = getEnvironmentVariable("POSTHOG_API_KEY") ?? ""
        let host = getEnvironmentVariable("POSTHOG_HOST") ?? ""

        guard !apiKey.isEmpty, !host.isEmpty else { return }

        let config = PostHogConfig(apiKey: apiKey, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
        isInitialized = true
    }

    public func capture(_ event: String, properties: [String: Any]? = nil) {
        PostHogSDK.shared.capture(event, properties: properties)
    }

    public func identify(username: String) {
        PostHogSDK.shared.identify(username, userProperties: ["username": username])
    }

    public func reset() {
        PostHogSDK.shared.reset()
    }

    private func getEnvironmentVariable(_ key: String) -> String? {
        if let value = ProcessInfo.processInfo.environment[key] {
            return value
        }
        return Bundle.main.infoDictionary?[key] as? String
    }
}
