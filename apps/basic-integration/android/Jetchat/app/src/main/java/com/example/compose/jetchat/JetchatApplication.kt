package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        if (!isPostHogConfigured(BuildConfig.POSTHOG_API_KEY, "POSTHOG_API_KEY") ||
            !isPostHogConfigured(BuildConfig.POSTHOG_HOST, "POSTHOG_HOST")
        ) {
            return
        }

        PostHogAndroid.setup(
            this,
            PostHogAndroidConfig(
                projectToken = BuildConfig.POSTHOG_API_KEY,
                host = BuildConfig.POSTHOG_HOST,
            ).apply {
                errorTrackingConfig.autoCapture = true
                logs.serviceName = "jetchat-android"
                logs.environment = if (BuildConfig.DEBUG) "debug" else "release"
                logs.serviceVersion = BuildConfig.VERSION_NAME
            },
        )
    }

    private fun isPostHogConfigured(value: String, key: String): Boolean {
        if (value.isNotBlank()) return true

        if (BuildConfig.DEBUG) {
            error(
                "$key variable required by PostHog is missing or un-configured, " +
                    "this causes events to be silently missed. This error stops appearing once " +
                    "$key is configured",
            )
        }

        return false
    }
}
