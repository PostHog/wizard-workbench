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
                if let user {
                    PostHogAnalytics.identify(user: user)
                }
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
        if let user {
            PostHogAnalytics.identify(user: user)
            PostHogAnalytics.capture("login_succeeded", properties: [
                "auth_method": "username_password"
            ])
        }
        return .authenticated
    }

    public func unauthenticate() {
        PostHogAnalytics.capture("user_logged_out")
        PostHogAnalytics.reset()
        Task { [weak self] in
            guard let self else { return }
            try? await authenticationUseCase.logout()
            await MainActor.run { self.user = nil }
        }
    }

    public enum AuthenticationState {
        case authenticated
        case notAuthenticated
    }
}
