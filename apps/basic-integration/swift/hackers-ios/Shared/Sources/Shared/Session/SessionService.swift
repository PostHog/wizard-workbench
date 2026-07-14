//
//  SessionService.swift
//  Shared
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Combine
import Domain
import Foundation
import Observation
import PostHog

@MainActor
@Observable
public final class SessionService: AuthenticationServiceProtocol {
    private var user: Domain.User?
    private let authenticationUseCase: any AuthenticationUseCase
    private nonisolated(unsafe) var logoutObserver: NSObjectProtocol?

    public init(authenticationUseCase: any AuthenticationUseCase) {
        self.authenticationUseCase = authenticationUseCase

        Task { [weak self] in
            guard let self else { return }
            let user = await authenticationUseCase.getCurrentUser()
            await MainActor.run {
                self.user = user
                self.identifyIfNeeded(for: user)
            }
        }

        logoutObserver = NotificationCenter.default.addObserver(
            forName: .userDidLogout,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.user = nil
            }
        }
    }

    deinit {
        if let observer = logoutObserver {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    public var authenticationState: AuthenticationState {
        user == nil ? .notAuthenticated : .authenticated
    }

    public var username: String? {
        user?.username
    }

    // MARK: - AuthenticationServiceProtocol

    public var isAuthenticated: Bool {
        authenticationState == .authenticated
    }

    public func showLogin() {
        // NavigationStore handles presentation in the view layer.
    }

    public func authenticate(username: String, password: String) async throws -> AuthenticationState {
        try await authenticationUseCase.authenticate(username: username, password: password)
        user = await authenticationUseCase.getCurrentUser()
        identifyIfNeeded(for: user)
        PostHogSDK.shared.capture("login_succeeded", properties: [
            "authentication_method": "password"
        ])
        return .authenticated
    }

    public func unauthenticate() {
        PostHogSDK.shared.capture("logout_completed")
        PostHogSDK.shared.reset()
        Task { [weak self] in
            guard let self else { return }
            try? await authenticationUseCase.logout()
            await MainActor.run { self.user = nil }
        }
    }

    private func identifyIfNeeded(for user: Domain.User?) {
        guard let user else { return }
        PostHogSDK.shared.identify(user.username, userProperties: [
            "username": user.username,
            "karma": user.karma,
            "joined_at": ISO8601DateFormatter().string(from: user.joined)
        ])
    }

    public enum AuthenticationState {
        case authenticated
        case notAuthenticated
    }
}
