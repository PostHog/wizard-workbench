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
    private let postHogProjectToken = Bundle.main.object(forInfoDictionaryKey: "POSTHOG_API_KEY") as? String
    private let postHogHost = Bundle.main.object(forInfoDictionaryKey: "POSTHOG_HOST") as? String

    func application(_: UIApplication,
                     didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
        // Configure a modest shared URL cache to limit on-disk growth from image/HTTP caching
        // This affects system components like AsyncImage that use URLSession.shared
        let memoryCapacity = 64 * 1024 * 1024 // 64 MB
        let diskCapacity = 128 * 1024 * 1024 // 128 MB
        URLCache.shared = URLCache(memoryCapacity: memoryCapacity, diskCapacity: diskCapacity)

        configurePostHog()

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
        guard let postHogProjectToken, let postHogHost else { return }

        let config = PostHogConfig(apiKey: postHogProjectToken, host: postHogHost)
        config.captureApplicationLifecycleEvents = true
        config.captureScreenViews = false
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }
}
