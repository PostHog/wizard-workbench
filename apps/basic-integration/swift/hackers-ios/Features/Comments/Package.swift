//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "Comments",
    platforms: [.iOS(.v26)],
    products: [
        .library(
            name: "Comments",
            targets: ["Comments"],
        )
    ],
    dependencies: [
        .package(path: "../../Domain"),
        .package(path: "../../Shared"),
        .package(path: "../../DesignSystem"),
        .package(url: "https://github.com/PostHog/posthog-ios", from: "3.58.3")
    ],
    targets: [
        .target(
            name: "Comments",
            dependencies: ["Domain", "Shared", "DesignSystem", .product(name: "PostHog", package: "posthog-ios")],
        ),
        .testTarget(
            name: "CommentsTests",
            dependencies: ["Comments", "Domain", "Shared"],
        )
    ],
)
