import Foundation
import OSLog
import PostHog

public enum PostHogAnalytics {
    private static let apiKeyName = "POSTHOG_API_KEY"
    private static let hostName = "POSTHOG_HOST"
    private static let logger = Logger(subsystem: "com.weiranzhang.Hackers", category: "analytics")
    private static var hasConfigured = false

    public static func setup() {
        guard !hasConfigured else { return }
        guard let apiKey = configurationValue(named: apiKeyName),
              let host = configurationValue(named: hostName)
        else {
            logger.error("PostHog configuration missing")
            return
        }

        let config = PostHogConfig(apiKey: apiKey, host: host)
        config.captureApplicationLifecycleEvents = true
        config.errorTrackingConfig.autoCapture = true
        PostHogSDK.shared.setup(config)
        hasConfigured = true
    }

    public static func capture(_ event: String, properties: [String: Any] = [:]) {
        setup()
        PostHogSDK.shared.capture(event, properties: properties)
    }

    public static func identify(username: String) {
        setup()
        let distinctId = "hn:\(username.lowercased())"
        PostHogSDK.shared.identify(distinctId, userProperties: [
            "username": username,
        ])
    }

    public static func flush() {
        PostHogSDK.shared.flush()
    }

    public static func reset() {
        PostHogSDK.shared.reset()
    }

    private static func configurationValue(named name: String) -> String? {
        if let value = ProcessInfo.processInfo.environment[name], value.isEmpty == false {
            return value
        }

        if let value = Bundle.main.object(forInfoDictionaryKey: name) as? String,
           value.isEmpty == false,
           value != "$(\(name))"
        {
            return value
        }

        return nil
    }
}
