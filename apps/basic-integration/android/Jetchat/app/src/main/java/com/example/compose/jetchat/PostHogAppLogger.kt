package com.example.compose.jetchat

import com.posthog.PostHog

object PostHogAppLogger {
    fun loginCompleted() {
        if (postHogIsConfigured()) {
            PostHog.logger.info(
                "demo login completed",
                mapOf("authentication_flow" to "demo"),
            )
        }
    }

    fun messageAdded(inputMethod: String) {
        if (postHogIsConfigured()) {
            PostHog.logger.info(
                "conversation message added",
                mapOf("input_method" to inputMethod),
            )
        }
    }

    fun widgetPinRequested() {
        if (postHogIsConfigured()) {
            PostHog.logger.info("widget pin requested")
        }
    }
}
