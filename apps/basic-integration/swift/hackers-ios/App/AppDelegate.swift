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
        let environment = ProcessInfo.processInfo.environment
        let projectToken = environment["POSTHOG_PROJECT_TOKEN"].flatMap { $0.isEmpty ? nil : $0 }
            ?? "phc_nmum54dVqUBEAmNrWgHdnRF8HRSCVQhxL6kRhy4GCV6a"
        let host = environment["POSTHOG_HOST"].flatMap { $0.isEmpty ? nil : $0 }
            ?? "https://us.i.posthog.com"
        let config = PostHogConfig(projectToken: projectToken, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }
}
