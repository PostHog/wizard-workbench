//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "Authentication",
    platforms: [
        .iOS(.v26)
    ],
    products: [
        .library(
            name: "Authentication",
            targets: ["Authentication"],
        )
    ],
    dependencies: [
        .package(path: "../../Domain"),
        .package(path: "../../Shared"),
        .package(path: "../../DesignSystem"),
        .package(url: "https://github.com/PostHog/posthog-ios.git", from: "3.64.0")
    ],
    targets: [
        .target(
            name: "Authentication",
            dependencies: ["Domain", "Shared", "DesignSystem", .product(name: "PostHog", package: "posthog-ios")],
        ),
        .testTarget(
            name: "AuthenticationTests",
            dependencies: ["Authentication"],
            path: "Tests/AuthenticationTests"
        )
    ],
)
