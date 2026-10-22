//
//  Analytics.swift
//  Shared
//

import PostHog

public enum Analytics {
    public static func capture(_ event: String, properties: [String: Any] = [:]) {
        PostHogSDK.shared.capture(event, properties: properties)
    }
}

public enum PostHogLog {
    public static func info(_ message: String) {
        PostHogSDK.shared.logger?.info(message)
    }
}
