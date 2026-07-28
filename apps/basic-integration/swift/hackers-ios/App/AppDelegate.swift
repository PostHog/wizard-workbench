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
    private var postHogEventObserver: NSObjectProtocol?

    func application(_: UIApplication,
                     didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        setupPostHog()
        observePostHogEvents()

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

    private func observePostHogEvents() {
        postHogEventObserver = NotificationCenter.default.addObserver(
            forName: .postHogEvent,
            object: nil,
            queue: .main
        ) { notification in
            guard let event = notification.userInfo?["event"] as? String else { return }
            let properties = notification.userInfo?.reduce(into: [String: Any]()) { properties, pair in
                guard let key = pair.key as? String, key != "event" else { return }
                properties[key] = pair.value
            }
            PostHogSDK.shared.capture(event, properties: properties)
        }
    }

    private func setupPostHog() {
        let environment = ProcessInfo.processInfo.environment
        let projectToken = environment["POSTHOG_PROJECT_TOKEN"]
            ?? Bundle.main.object(forInfoDictionaryKey: "POSTHOG_PROJECT_TOKEN") as? String
        guard let projectToken, !projectToken.isEmpty else {
            #if DEBUG
            assertionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #endif
            return
        }
        let host = environment["POSTHOG_HOST"]
            ?? Bundle.main.object(forInfoDictionaryKey: "POSTHOG_HOST") as? String
        guard let host, !host.isEmpty else {
            #if DEBUG
            assertionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #endif
            return
        }

        let config = PostHogConfig(apiKey: projectToken, host: host)
        config.captureApplicationLifecycleEvents = true
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }
}
