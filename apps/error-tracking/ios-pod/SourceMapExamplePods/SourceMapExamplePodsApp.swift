import Foundation
import PostHog
import SwiftUI

@main
struct SourceMapExamplePodsApp: App {
    init() {
        let environment = ProcessInfo.processInfo.environment
        let config = PostHogConfig(
            projectToken: "phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA",
            host: "https://internal-c.posthog.com"
        )
        PostHogSDK.shared.setup(config)
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
