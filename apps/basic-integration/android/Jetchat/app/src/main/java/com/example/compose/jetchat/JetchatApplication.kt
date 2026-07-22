package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

object PostHogAnalytics {
    private var isInitialized = false

    fun capture(event: String) {
        if (isInitialized) {
            PostHogAndroid.getInstance().capture(event)
        }
    }

    internal fun markInitialized() {
        isInitialized = true
    }
}

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val apiKey = BuildConfig.POSTHOG_PROJECT_TOKEN
        val host = BuildConfig.POSTHOG_HOST
        if (apiKey.isNullOrBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            }
            return
        }
        if (host.isNullOrBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            }
            return
        }

        val config = PostHogAndroidConfig(apiKey = apiKey, host = host).apply {
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
        PostHogAnalytics.markInitialized()
    }
}
