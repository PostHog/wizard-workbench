package com.example.compose.jetchat

import android.app.Application
import com.posthog.PostHog
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val apiKey = BuildConfig.POSTHOG_API_KEY
        val host = BuildConfig.POSTHOG_HOST

        if (apiKey.isBlank()) {
            requirePostHogConfig("POSTHOG_API_KEY")
            return
        }
        if (host.isBlank()) {
            requirePostHogConfig("POSTHOG_HOST")
            return
        }

        PostHogAndroid.setup(
            this,
            PostHogAndroidConfig(apiKey = apiKey, host = host).apply {
                errorTrackingConfig.autoCapture = true
                logs.serviceName = packageName
            },
        )
        postHogConfigured = true
    }

    private fun requirePostHogConfig(variableName: String) {
        if (BuildConfig.DEBUG) {
            error(
                "$variableName variable required by PostHog is missing or un-configured, " +
                    "this causes events to be silently missed. This error stops appearing once " +
                    "$variableName is configured",
            )
        }
    }

    companion object {
        @Volatile
        private var postHogConfigured = false

        fun capture(event: String) {
            if (postHogConfigured) {
                PostHog.capture(event)
            }
        }

        fun logInfo(message: String) {
            if (postHogConfigured) {
                PostHog.logger.info(message)
            }
        }
    }
}
