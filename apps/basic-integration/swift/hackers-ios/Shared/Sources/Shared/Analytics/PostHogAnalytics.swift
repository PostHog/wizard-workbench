//
//  PostHogAnalytics.swift
//  Shared
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Domain
import Foundation
import PostHog

public enum PostHogAnalytics {
    public static func setup(apiKey: String, host: String) {
        let config = PostHogConfig(apiKey: apiKey, host: host)
        config.captureApplicationLifecycleEvents = true
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
        capture("app_opened")
    }

    public static func identify(user: User) {
        PostHogSDK.shared.identify(
            user.username,
            userProperties: [
                "username": user.username,
                "karma": user.karma,
                "joined_at": ISO8601DateFormatter().string(from: user.joined)
            ]
        )
    }

    public static func reset() {
        PostHogSDK.shared.reset()
    }

    public static func capture(_ event: String, properties: [String: Any]? = nil) {
        PostHogSDK.shared.capture(event, properties: properties)
    }

    public static func captureError(_ error: Error, properties: [String: Any]? = nil) {
        var mergedProperties = properties ?? [:]
        mergedProperties["error_type"] = String(describing: type(of: error))
        PostHogSDK.shared.capture("app_error_occurred", properties: mergedProperties)
    }
}
