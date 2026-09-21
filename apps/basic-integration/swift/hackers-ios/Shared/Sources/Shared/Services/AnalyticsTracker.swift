//
//  AnalyticsTracker.swift
//  Hackers
//

import Foundation

@MainActor
public final class AnalyticsTracker {
    public static let shared = AnalyticsTracker()

    private var captureHandler: ((String, [String: Any]) -> Void)?

    private init() {}

    public func configure(captureHandler: @escaping (String, [String: Any]) -> Void) {
        self.captureHandler = captureHandler
    }

    public func capture(_ event: String, properties: [String: Any] = [:]) {
        captureHandler?(event, properties)
    }
}
