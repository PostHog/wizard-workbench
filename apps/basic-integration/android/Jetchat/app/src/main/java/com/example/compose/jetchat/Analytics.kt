package com.example.compose.jetchat

import com.posthog.PostHog

internal fun captureAnalyticsEvent(event: String, properties: Map<String, Any> = emptyMap()) {
    if (BuildConfig.POSTHOG_PROJECT_TOKEN.isBlank() || BuildConfig.POSTHOG_HOST.isBlank()) {
        return
    }

    PostHog.capture(event = event, properties = properties)
}
