//
//  HackersApp.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import PostHog
import Shared
import SwiftUI

// The PostHog project token is a public client-side key safe to ship in the binary.
// POSTHOG_PROJECT_TOKEN / POSTHOG_HOST Xcode environment variables act as optional
// overrides (debug/simulator only); the hardcoded values ship in Archive/Release builds.
private let posthogApiKey = ProcessInfo.processInfo.environment["POSTHOG_PROJECT_TOKEN"] ?? "sTMFPsFhdP1Ssg"
private let posthogHost = ProcessInfo.processInfo.environment["POSTHOG_HOST"] ?? "https://us.i.posthog.com"

@main
struct HackersApp: App {
    @State private var navigationStore = NavigationStore()
    @State private var sessionService = DependencyContainer.shared.makeSessionService()
    @State private var toastPresenter = DependencyContainer.shared.makeToastPresenter()

    // Keep AppDelegate for legacy services and setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        let config = PostHogConfig(apiKey: posthogApiKey, host: posthogHost)
        config.captureApplicationLifecycleEvents = true
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
