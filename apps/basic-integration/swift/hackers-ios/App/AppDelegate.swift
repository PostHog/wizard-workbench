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
        let environment = ProcessInfo.processInfo.environment
        let projectToken = environment["POSTHOG_PROJECT_TOKEN"]
            ?? Bundle.main.object(forInfoDictionaryKey: "POSTHOG_PROJECT_TOKEN") as? String
        let host = environment["POSTHOG_HOST"]
            ?? Bundle.main.object(forInfoDictionaryKey: "POSTHOG_HOST") as? String

        if let projectToken, !projectToken.isEmpty,
           let host, !host.isEmpty
        {
            let config = PostHogConfig(projectToken: projectToken, host: host)
            config.errorTrackingConfig.autoCapture = true
            PostHogSDK.shared.setup(config)
        } else {
            #if DEBUG
            if projectToken?.isEmpty != false {
                assertionFailure("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            }
            if host?.isEmpty != false {
                assertionFailure("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            }
            #endif
        }

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
}
