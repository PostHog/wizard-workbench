//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "Settings",
    platforms: [
        .iOS(.v26)
    ],
    products: [
        .library(
            name: "Settings",
            targets: ["Settings"],
        )
    ],
    dependencies: [
        .package(path: "../../Domain"),
        .package(path: "../../Shared"),
        .package(path: "../../DesignSystem"),
        .package(path: "../Authentication"),
        .package(path: "../Onboarding"),
        .package(url: "https://github.com/PostHog/posthog-ios", from: "3.60.0")
    ],
    targets: [
        .target(
            name: "Settings",
            dependencies: ["Domain", "Shared", "DesignSystem", "Authentication", "Onboarding", "PostHog"],
        ),
        .testTarget(
            name: "SettingsTests",
            dependencies: ["Settings"],
            path: "Tests/SettingsTests",
        )
    ],
)
