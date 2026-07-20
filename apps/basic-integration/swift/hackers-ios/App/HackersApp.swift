//
//  HackersApp.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import PostHog
import Shared
import SwiftUI

@main
struct HackersApp: App {
    @State private var navigationStore = NavigationStore()
    @State private var sessionService = DependencyContainer.shared.makeSessionService()
    @State private var toastPresenter = DependencyContainer.shared.makeToastPresenter()

    // Keep AppDelegate for legacy services and setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        guard let apiKey = Bundle.main.object(forInfoDictionaryKey: "POSTHOG_PROJECT_TOKEN") as? String,
              let host = Bundle.main.object(forInfoDictionaryKey: "POSTHOG_HOST") as? String,
              !apiKey.isEmpty,
              !host.isEmpty
        else {
            assertionFailure("PostHog configuration is missing")
            return
        }

        let config = PostHogConfig(apiKey: apiKey, host: host)
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
    }

    var body: some Scene {
        WindowGroup {
            MainContentView()
                .environment(navigationStore)
                .environment(sessionService)
                .environment(toastPresenter)
                .onAppear {
                    setupAppearance()
                }
                .onOpenURL { url in
                    handleOpenURL(url)
                }
        }
    }

    private func setupAppearance() {
        // Apply app-wide appearance settings
        if let appTintColor = UIColor(named: "appTintColor") {
            UIView.appearance().tintColor = appTintColor
        }
    }

    private func handleOpenURL(_ url: URL) {
        navigationStore.handleOpenURL(url)
    }
}
