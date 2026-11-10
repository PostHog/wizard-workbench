package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val projectToken = BuildConfig.POSTHOG_API_KEY
        val host = BuildConfig.POSTHOG_HOST
        if (projectToken.isBlank()) {
            requirePostHogConfiguration("POSTHOG_API_KEY")
            return
        }
        if (host.isBlank()) {
            requirePostHogConfiguration("POSTHOG_HOST")
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
            },
        )
    }

    private fun requirePostHogConfiguration(variableName: String) {
        if (BuildConfig.DEBUG) {
            error(
                "$variableName variable required by PostHog is missing or un-configured, " +
                    "this causes events to be silently missed. This error stops appearing once " +
                    "$variableName is configured",
            )
        }
    }
}
