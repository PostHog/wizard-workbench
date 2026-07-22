//
//  Analytics.swift
//  Hackers
//

import PostHog

@MainActor
public enum Analytics {
    public static func capture(_ event: String, properties: [String: Any] = [:]) {
        PostHogSDK.shared.capture(event, properties: properties)
    }
}
