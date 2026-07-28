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
    private var analyticsEventObserver: NSObjectProtocol?

    func application(_: UIApplication,
                     didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        configurePostHog()
        observeAnalyticsEvents()

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

    private func observeAnalyticsEvents() {
        analyticsEventObserver = NotificationCenter.default.addObserver(
            forName: AnalyticsEvent.notificationName,
            object: nil,
            queue: .main
        ) { notification in
            guard let eventName = notification.object as? String else { return }
            PostHogSDK.shared.capture(eventName)
        }
    }

    private func configurePostHog() {
        guard let projectToken = ProcessInfo.processInfo.environment["POSTHOG_PROJECT_TOKEN"],
              !projectToken.isEmpty else {
            #if DEBUG
            preconditionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #else
            return
            #endif
        }
        guard let host = ProcessInfo.processInfo.environment["POSTHOG_HOST"], !host.isEmpty else {
            #if DEBUG
            preconditionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #else
            return
            #endif
        }

        let config = PostHogConfig(projectToken: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }
}
