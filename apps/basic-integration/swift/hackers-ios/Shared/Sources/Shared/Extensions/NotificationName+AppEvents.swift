//
//  NotificationName+AppEvents.swift
//  Shared
//
//  Defines app-specific notification names.
//

import Foundation

public extension Notification.Name {
    static let refreshRequired = NSNotification.Name(rawValue: "RefreshRequiredNotification")
    static let userDidLogout = NSNotification.Name(rawValue: "UserDidLogoutNotification")
    static let bookmarksDidChange = NSNotification.Name(rawValue: "BookmarksDidChangeNotification")
    static let analyticsEventOccurred = NSNotification.Name(rawValue: "AnalyticsEventOccurredNotification")
}

public enum AppAnalytics {
    public static let eventNameKey = "eventName"
    public static let propertiesKey = "properties"

    public static func record(_ eventName: String, properties: [String: Any] = [:]) {
        NotificationCenter.default.post(
            name: .analyticsEventOccurred,
            object: nil,
            userInfo: [eventNameKey: eventName, propertiesKey: properties]
        )
    }
}
