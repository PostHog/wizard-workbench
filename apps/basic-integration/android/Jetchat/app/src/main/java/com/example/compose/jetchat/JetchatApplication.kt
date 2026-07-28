package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val token = BuildConfig.POSTHOG_PROJECT_TOKEN
        val host = BuildConfig.POSTHOG_HOST
        val missingToken = token == "__POSTHOG_PROJECT_TOKEN_MISSING__"
        val missingHost = host == "__POSTHOG_HOST_MISSING__"

        if (missingToken || missingHost) {
            if (BuildConfig.DEBUG) {
                val missingVariable = if (missingToken) "POSTHOG_PROJECT_TOKEN" else "POSTHOG_HOST"
                error("$missingVariable variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once $missingVariable is configured")
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
