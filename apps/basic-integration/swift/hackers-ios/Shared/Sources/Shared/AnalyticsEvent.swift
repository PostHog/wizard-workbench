//
//  AnalyticsEvent.swift
//  Shared
//
//  Centralizes PostHog event names emitted by feature modules.
//

import Foundation

public enum AnalyticsEvent: String {
    case loginSucceeded = "login_succeeded"
    case logoutCompleted = "logout_completed"
    case postUpvoted = "post_upvoted"
    case postUnvoted = "post_unvoted"
    case commentUpvoted = "comment_upvoted"
    case commentUnvoted = "comment_unvoted"
    case bookmarkAdded = "bookmark_added"
    case bookmarkRemoved = "bookmark_removed"
    case postShareStarted = "post_share_started"
    case supportPurchaseCompleted = "support_purchase_completed"
    case purchasesRestored = "purchases_restored"

    public static let notificationName = Notification.Name("analyticsEventOccurred")

    public func capture() {
        NotificationCenter.default.post(
            name: Self.notificationName,
            object: self.rawValue
        )
    }
}
