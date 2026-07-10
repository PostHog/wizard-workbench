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
@_exported import PostHog

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
            await MainActor.run { self.user = user }
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
        if let username = user?.username {
            PostHogSDK.shared.identify(username, userProperties: ["username": username])
        }
        return .authenticated
    }

    public func unauthenticate() {
        Task { [weak self] in
            guard let self else { return }
            try? await authenticationUseCase.logout()
            await MainActor.run {
                self.user = nil
                PostHogSDK.shared.reset()
            }
        }
    }

    public enum AuthenticationState {
        case authenticated
        case notAuthenticated
    }
}
