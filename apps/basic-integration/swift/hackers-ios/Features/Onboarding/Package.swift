//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "Onboarding",
    platforms: [
        .iOS(.v26)
    ],
    products: [
        .library(
            name: "Onboarding",
            targets: ["Onboarding"],
        )
    ],
    dependencies: [
        .package(path: "../../Domain"),
        .package(path: "../../Shared"),
        .package(path: "../../DesignSystem"),
        .package(url: "https://github.com/PostHog/posthog-ios", from: "3.59.3")
    ],
    targets: [
        .target(
            name: "Onboarding",
            dependencies: ["Domain", "Shared", "DesignSystem", .product(name: "PostHog", package: "posthog-ios")],
        ),
        .testTarget(
            name: "OnboardingTests",
            dependencies: ["Onboarding"],
            path: "Tests/OnboardingTests",
        )
    ],
)
