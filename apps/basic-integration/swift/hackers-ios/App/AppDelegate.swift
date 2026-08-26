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
        guard let projectToken = postHogConfigurationValue(for: "POSTHOG_PROJECT_TOKEN") else {
            reportMissingPostHogConfiguration("POSTHOG_PROJECT_TOKEN")
            return
        }
        guard let host = postHogConfigurationValue(for: "POSTHOG_HOST") else {
            reportMissingPostHogConfiguration("POSTHOG_HOST")
            return
        }

        let config = PostHogConfig(projectToken: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }

    private func postHogConfigurationValue(for key: String) -> String? {
        let value = ProcessInfo.processInfo.environment[key]
            ?? Bundle.main.object(forInfoDictionaryKey: key) as? String
        guard let value, !value.isEmpty, value != "$(\(key))" else { return nil }
        return value
    }

    private func reportMissingPostHogConfiguration(_ variable: String) {
        #if DEBUG
        assertionFailure("\(variable) variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once \(variable) is configured")
        #endif
    }
}
