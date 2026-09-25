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
        let bundledConfig = bundledPostHogConfiguration()
        let environment = ProcessInfo.processInfo.environment
        let projectToken = environment["POSTHOG_PROJECT_TOKEN"].flatMap { $0.isEmpty ? nil : $0 }
            ?? bundledConfig["POSTHOG_PROJECT_TOKEN"]
        guard let projectToken, !projectToken.isEmpty else {
            #if DEBUG
            assertionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            #endif
            return
        }

        let host = environment["POSTHOG_HOST"].flatMap { $0.isEmpty ? nil : $0 }
            ?? bundledConfig["POSTHOG_HOST"]
        guard let host, !host.isEmpty else {
            #if DEBUG
            assertionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            #endif
            return
        }

        let config = PostHogConfig(apiKey: projectToken, host: host)
        if let bundleIdentifier = Bundle.main.bundleIdentifier {
            config.logs.serviceName = bundleIdentifier
        }
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }

    private func bundledPostHogConfiguration() -> [String: String] {
        guard let url = Bundle.main.url(forResource: "PostHogConfig", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let propertyList = try? PropertyListSerialization.propertyList(from: data, format: nil),
              let configuration = propertyList as? [String: String]
        else {
            return [:]
        }
        return configuration
    }
}
