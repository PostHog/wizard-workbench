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
        // PostHog: Identify user and track sign-in
        PostHogSDK.shared.identify(username, userProperties: ["username": username])
        PostHogSDK.shared.capture("user_signed_in", properties: ["username": username])
        return .authenticated
    }

    public func unauthenticate() {
        let currentUsername = username
        Task { [weak self] in
            guard let self else { return }
            try? await authenticationUseCase.logout()
            await MainActor.run {
                // PostHog: Track sign-out and reset identity
                PostHogSDK.shared.capture("user_signed_out", properties: ["username": currentUsername ?? "unknown"])
                PostHogSDK.shared.reset()
                self.user = nil
            }
        }
    }

    public enum AuthenticationState {
        case authenticated
        case notAuthenticated
    }
}
