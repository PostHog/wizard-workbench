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
        // Configure a modest shared URL cache to limit on-disk growth from image/HTTP caching
        // This affects system components like AsyncImage that use URLSession.shared
        let memoryCapacity = 64 * 1024 * 1024 // 64 MB
        let diskCapacity = 128 * 1024 * 1024 // 128 MB
        URLCache.shared = URLCache(memoryCapacity: memoryCapacity, diskCapacity: diskCapacity)

        // PostHog initialization — the project token is a public client-side key safe to ship in the binary.
        // Scheme env vars (POSTHOG_PROJECT_TOKEN) are an optional debug override; they are absent in
        // Archive/Release builds, so the literal fallback ensures production builds always have a token.
        let posthogToken = ProcessInfo.processInfo.environment["POSTHOG_PROJECT_TOKEN"]
            ?? "phc_nmum54dVqUBEAmNrWgHdnRF8HRSCVQhxL6kRhy4GCV6a"
        let posthogHost = ProcessInfo.processInfo.environment["POSTHOG_HOST"]
            ?? "https://us.i.posthog.com"
        let config = PostHogConfig(apiKey: posthogToken, host: posthogHost)
        config.captureApplicationLifecycleEvents = true
        PostHogSDK.shared.setup(config)

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
