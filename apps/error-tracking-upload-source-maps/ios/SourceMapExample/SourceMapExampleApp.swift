import Foundation
import PostHog
import SwiftUI

@main
struct SourceMapExampleApp: App {
    init() {
        let environment = ProcessInfo.processInfo.environment
        let config = PostHogConfig(
            projectToken: environment["POSTHOG_PROJECT_TOKEN"] ?? "test_project_token",
            host: environment["POSTHOG_HOST"] ?? "https://us.i.posthog.com"
        )
        PostHogSDK.shared.setup(config)
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
