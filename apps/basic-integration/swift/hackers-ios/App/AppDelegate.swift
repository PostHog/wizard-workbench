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
        if let config = postHogConfiguration() {
            PostHogSDK.shared.setup(config)
            PostHogSDK.shared.capture("app_opened")
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

    private func postHogConfiguration() -> PostHogConfig? {
        let infoDictionary = Bundle.main.infoDictionary
        let apiKey = ProcessInfo.processInfo.environment["POSTHOG_API_KEY"]
            ?? infoDictionary?["POSTHOG_API_KEY"] as? String
        let host = ProcessInfo.processInfo.environment["POSTHOG_HOST"]
            ?? infoDictionary?["POSTHOG_HOST"] as? String
            ?? "https://us.i.posthog.com"

        guard let apiKey, apiKey.isEmpty == false else {
            assertionFailure("Missing PostHog API key configuration")
            return nil
        }

        let config = PostHogConfig(apiKey: apiKey, host: host)
        config.captureApplicationLifecycleEvents = true
        config.debug = true
        return config
    }
}
