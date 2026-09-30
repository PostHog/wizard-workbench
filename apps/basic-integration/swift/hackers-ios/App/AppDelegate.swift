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
        setupPostHog()

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

    private func setupPostHog() {
        guard let projectToken = postHogConfigurationValue(for: "POSTHOG_PROJECT_TOKEN") else {
            #if DEBUG
            assertionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #endif
            return
        }

        guard let host = postHogConfigurationValue(for: "POSTHOG_HOST") else {
            #if DEBUG
            assertionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #endif
            return
        }

        let config = PostHogConfig(projectToken: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        config.logs.serviceName = "Hackers"
        PostHogSDK.shared.setup(config)
    }

    private func postHogConfigurationValue(for key: String) -> String? {
        if let value = ProcessInfo.processInfo.environment[key], !value.isEmpty {
            return value
        }

        guard let url = Bundle.main.url(forResource: "PostHog", withExtension: "env"),
              let contents = try? String(contentsOf: url, encoding: .utf8),
              let line = contents.split(whereSeparator: \.isNewline).first(where: { $0.hasPrefix("\(key)=") })
        else {
            return nil
        }

        let value = line.dropFirst(key.count + 1)
        return value.isEmpty ? nil : String(value)
    }
}
