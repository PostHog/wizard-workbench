package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

internal fun postHogOrNull() =
    if (BuildConfig.POSTHOG_API_KEY.isNotBlank() && BuildConfig.POSTHOG_HOST.isNotBlank()) {
        PostHogAndroid.getInstance()
    } else {
        null
    }

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val projectToken = BuildConfig.POSTHOG_API_KEY
        val host = BuildConfig.POSTHOG_HOST

        if (projectToken.isBlank() || host.isBlank()) {
            if (BuildConfig.DEBUG) {
                val missingVariable = if (projectToken.isBlank()) "POSTHOG_API_KEY" else "POSTHOG_HOST"
                error(
                    "$missingVariable variable required by PostHog is missing or un-configured, " +
                        "this causes events to be silently missed. This error stops appearing once " +
                        "$missingVariable is configured",
                )
            }
            return
        }

        PostHogAndroid.setup(
            this,
            PostHogAndroidConfig(
                projectToken = projectToken,
                host = host,
            ).apply {
                errorTrackingConfig.autoCapture = true
                logs.serviceName = "jetchat-android"
                logs.environment = if (BuildConfig.DEBUG) "debug" else "release"
            },
        )
    }
}
