//
//  HackersApp.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import PostHog
import Shared
import SwiftUI

// PostHog configuration.
// The project token is a public client-side key designed to ship in the app binary.
private let posthogProjectToken = "sTMFPsFhdP1Ssg"
private let posthogHost = "https://us.i.posthog.com"

@main
struct HackersApp: App {
    @State private var navigationStore = NavigationStore()
    @State private var sessionService = DependencyContainer.shared.makeSessionService()
    @State private var toastPresenter = DependencyContainer.shared.makeToastPresenter()

    // Keep AppDelegate for legacy services and setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        let config = PostHogConfig(apiKey: posthogProjectToken, host: posthogHost)
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
