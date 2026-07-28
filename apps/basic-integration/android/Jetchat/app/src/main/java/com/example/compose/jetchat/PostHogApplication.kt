package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class PostHogApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val token = BuildConfig.POSTHOG_PROJECT_TOKEN
        val host = BuildConfig.POSTHOG_HOST
        if (token.isBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured")
            }
            return
        }
        if (host.isBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured")
            }
            return
        }

        val config = PostHogAndroidConfig(
            apiKey = token,
            host = host,
        ).apply {
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
    }
}
