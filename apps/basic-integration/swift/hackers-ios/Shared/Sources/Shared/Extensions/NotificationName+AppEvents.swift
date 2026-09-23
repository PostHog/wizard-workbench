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
    static let postBookmarked = NSNotification.Name(rawValue: "PostBookmarkedNotification")
    static let bookmarkRemoved = NSNotification.Name(rawValue: "BookmarkRemovedNotification")
    static let postUpvoted = NSNotification.Name(rawValue: "PostUpvotedNotification")
    static let postUnvoted = NSNotification.Name(rawValue: "PostUnvotedNotification")
    static let commentUpvoted = NSNotification.Name(rawValue: "CommentUpvotedNotification")
    static let commentUnvoted = NSNotification.Name(rawValue: "CommentUnvotedNotification")
}
