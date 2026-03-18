//
//  LoginViewModel.swift
//  Authentication
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Domain
import PostHog
import SwiftUI

@MainActor
@Observable
public final class LoginViewModel {
    public var username: String
    public var password: String
    public private(set) var isAuthenticating: Bool
    public var showAlert: Bool
    public var isAuthenticated: Bool
    public var currentUsername: String?

    public let textSize: TextSize

    private let onLogin: (String, String) async throws -> Void
    private let onLogout: () -> Void

    public init(
        isAuthenticated: Bool,
        currentUsername: String?,
        onLogin: @escaping (String, String) async throws -> Void,
        onLogout: @escaping () -> Void,
        textSize: TextSize = .medium,
        username: String = "",
        password: String = ""
    ) {
        self.isAuthenticated = isAuthenticated
        self.currentUsername = currentUsername
        self.onLogin = onLogin
        self.onLogout = onLogout
        self.textSize = textSize
        self.username = username
        self.password = password
        self.isAuthenticating = false
        self.showAlert = false
    }

    public var isLoginEnabled: Bool {
        !isAuthenticating && !username.isEmpty && !password.isEmpty
    }

    @discardableResult
    public func performLogin() async -> Bool {
        guard !isAuthenticating, !username.isEmpty, !password.isEmpty else {
            return false
        }

        isAuthenticating = true
        showAlert = false
        defer { isAuthenticating = false }

        do {
            try await onLogin(username, password)
            isAuthenticated = true
            currentUsername = username
            // PostHog: Identify user and capture login event
            PostHogSDK.shared.identify(username, userProperties: ["username": username])
            PostHogSDK.shared.capture("user_logged_in", properties: ["username": username])
            return true
        } catch {
            showAlert = true
            // PostHog: Capture login failure
            PostHogSDK.shared.capture("user_login_failed", properties: ["username": username])
            password = ""
            return false
        }
    }

    public func logout() {
        // PostHog: Capture logout and reset identity
        PostHogSDK.shared.capture("user_logged_out")
        PostHogSDK.shared.reset()
        onLogout()
        isAuthenticated = false
        currentUsername = nil
    }
}
