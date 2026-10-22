package com.example.compose.jetchat

import android.app.Application
import com.posthog.PostHog
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

internal fun postHogIsConfigured() =
    BuildConfig.POSTHOG_API_KEY.isNotBlank() && BuildConfig.POSTHOG_HOST.isNotBlank()

internal fun capturePostHog(event: String, properties: Map<String, Any> = emptyMap()) {
    if (postHogIsConfigured()) {
        PostHog.capture(event, properties)
    }
}

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val apiKey = BuildConfig.POSTHOG_API_KEY
        if (apiKey.isBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_API_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_API_KEY is configured")
            }
            return
        }

        val host = BuildConfig.POSTHOG_HOST
        if (host.isBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            }
            return
        }

        PostHogAndroid.setup(
            this,
            PostHogAndroidConfig(
                apiKey = apiKey,
                host = host,
            ).apply {
                errorTrackingConfig.autoCapture = true
                logs.serviceName = "jetchat-android"
            },
        )
    }
}
