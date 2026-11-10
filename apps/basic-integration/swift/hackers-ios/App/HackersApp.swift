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

    var body: some Scene {
        WindowGroup {
            MainContentView()
                .environment(navigationStore)
                .environment(sessionService)
                .environment(toastPresenter)
                .onAppear {
                    setupAppearance()
                    if let username = sessionService.username {
                        PostHogIdentity.identify(username: username)
                    }
                }
                .onChange(of: sessionService.username) { _, username in
                    if let username {
                        PostHogIdentity.identify(username: username)
                    } else {
                        PostHogSDK.shared.reset()
                    }
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

enum PostHogIdentity {
    static func identify(username: String) {
        var profileResource = URLComponents()
        profileResource.scheme = "https"
        profileResource.host = "news.ycombinator.com"
        profileResource.path = "/user"
        profileResource.queryItems = [URLQueryItem(name: "id", value: username)]

        guard let distinctId = profileResource.url?.absoluteString else { return }

        PostHogSDK.shared.identify(distinctId, userProperties: ["username": username])
    }
}
