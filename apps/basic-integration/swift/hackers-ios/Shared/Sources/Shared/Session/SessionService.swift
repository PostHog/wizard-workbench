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
                if let username = user?.username {
                    PostHogAnalytics.identify(username: username)
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
        PostHogAnalytics.identify(username: username)
        PostHogAnalytics.capture("login_succeeded", properties: [
            "authentication_state": "authenticated",
        ])
        return .authenticated
    }

    public func unauthenticate() {
        let wasAuthenticated = user != nil
        Task { [weak self] in
            guard let self else { return }
            try? await authenticationUseCase.logout()
            await MainActor.run {
                self.user = nil
                if wasAuthenticated {
                    PostHogAnalytics.capture("user_logged_out", properties: [
                        "source": "session_service",
                    ])
                    PostHogAnalytics.flush()
                    PostHogAnalytics.reset()
                }
            }
        }
    }

    public enum AuthenticationState {
        case authenticated
        case notAuthenticated
    }
}
