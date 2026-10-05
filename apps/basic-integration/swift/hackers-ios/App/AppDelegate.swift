//
//  AppDelegate.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Data
import PostHog
import Shared
import UIKit

class AppDelegate: NSObject, UIApplicationDelegate {
    private var logoutObserver: NSObjectProtocol?
    private var analyticsEventObserver: NSObjectProtocol?

    deinit {
        if let logoutObserver {
            NotificationCenter.default.removeObserver(logoutObserver)
        }
        if let analyticsEventObserver {
            NotificationCenter.default.removeObserver(analyticsEventObserver)
        }
    }

    func application(_: UIApplication,
                     didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        configurePostHog()

        // Configure a modest shared URL cache to limit on-disk growth from image/HTTP caching
        // This affects system components like AsyncImage that use URLSession.shared
        let memoryCapacity = 64 * 1024 * 1024 // 64 MB
        let diskCapacity = 128 * 1024 * 1024 // 128 MB
        URLCache.shared = URLCache(memoryCapacity: memoryCapacity, diskCapacity: diskCapacity)

        // process args for testing
        if ProcessInfo.processInfo.arguments.contains("disableReviewPrompts") {
            ReviewPromptController.disablePrompts = true
        }
        if ProcessInfo.processInfo.arguments.contains("skipAnimations") {
            UIView.setAnimationsEnabled(false)
        }

        // setup review prompt
        ReviewPromptController.incrementLaunchCounter()
        ReviewPromptController.requestReview()

        // init default settings
        UserDefaults.standard.registerDefaults()

        return true
    }

    private func configurePostHog() {
        guard let projectToken = postHogConfigurationValue(forKey: "POSTHOG_PROJECT_TOKEN") else {
            #if DEBUG
            assertionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #endif
            return
        }

        guard let host = postHogConfigurationValue(forKey: "POSTHOG_HOST") else {
            #if DEBUG
            assertionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #endif
            return
        }

        let config = PostHogConfig(apiKey: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        config.logs.serviceName = "hackers-ios"
        PostHogSDK.shared.setup(config)
        PostHogSDK.shared.logger?.info("PostHog log capture configured")

        logoutObserver = NotificationCenter.default.addObserver(
            forName: .userDidLogout,
            object: nil,
            queue: .main
        ) { _ in
            PostHogSDK.shared.logger?.info("PostHog identity reset after logout")
            PostHogSDK.shared.reset()
        }

        analyticsEventObserver = NotificationCenter.default.addObserver(
            forName: .analyticsEventOccurred,
            object: nil,
            queue: .main
        ) { notification in
            guard let eventName = notification.userInfo?[AppAnalytics.eventNameKey] as? String else { return }
            let properties = notification.userInfo?[AppAnalytics.propertiesKey] as? [String: Any] ?? [:]
            PostHogSDK.shared.logger?.info("Analytics event forwarded", attributes: ["event_name": eventName])
            PostHogSDK.shared.capture(eventName, properties: properties)
        }
    }

    private func postHogConfigurationValue(forKey key: String) -> String? {
        let value = ProcessInfo.processInfo.environment[key]
            ?? Bundle.main.object(forInfoDictionaryKey: key) as? String
        guard let value, !value.isEmpty, !value.contains("$(") else { return nil }
        return value
    }
}
