//
//  Package.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "Shared",
    platforms: [
        .iOS(.v26)
    ],
    products: [
        .library(
            name: "Shared",
            targets: ["Shared"],
        )
    ],
    dependencies: [
        .package(path: "../Domain"),
        .package(path: "../Data"),
        .package(path: "../Networking"),
        .package(url: "https://github.com/PostHog/posthog-ios", from: "3.48.0")
    ],
    targets: [
        .target(
            name: "Shared",
            dependencies: ["Domain", "Data", "Networking", .product(name: "PostHog", package: "posthog-ios")],
        ),
        .testTarget(
            name: "SharedTests",
            dependencies: ["Shared"],
            path: "Tests/SharedTests",
        )
    ],
)
