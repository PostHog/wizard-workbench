//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "Feed",
    platforms: [
        .iOS(.v26)
    ],
    products: [
        .library(
            name: "Feed",
            targets: ["Feed"],
        )
    ],
    dependencies: [
        .package(path: "../../Domain"),
        .package(path: "../../Shared"),
        .package(path: "../../DesignSystem"),
        .package(url: "https://github.com/PostHog/posthog-ios.git", from: "3.64.5")
    ],
    targets: [
        .target(
            name: "Feed",
            dependencies: ["Domain", "Shared", "DesignSystem", "PostHog"],
        ),
        .testTarget(
            name: "FeedTests",
            dependencies: ["Feed"],
            path: "Tests/FeedTests",
        )
    ],
)
