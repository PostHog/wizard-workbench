package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        if (BuildConfig.POSTHOG_PROJECT_TOKEN.isBlank()) {
            if (BuildConfig.DEBUG) {
                error(
                    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, " +
                        "this causes events to be silently missed. This error stops appearing once " +
                        "POSTHOG_PROJECT_TOKEN is configured",
                )
            }
            return
        }

        if (BuildConfig.POSTHOG_HOST.isBlank()) {
            if (BuildConfig.DEBUG) {
                error(
                    "POSTHOG_HOST variable required by PostHog is missing or un-configured, " +
                        "this causes events to be silently missed. This error stops appearing once " +
                        "POSTHOG_HOST is configured",
                )
            }
            return
        }

        val config = PostHogAndroidConfig(
            projectToken = BuildConfig.POSTHOG_PROJECT_TOKEN,
            host = BuildConfig.POSTHOG_HOST,
        ).apply {
            errorTrackingConfig.autoCapture = true
            logs.serviceName = "jetchat"
            logs.environment = if (BuildConfig.DEBUG) "debug" else "production"
        }
        PostHogAndroid.setup(this, config)
        PostHogAndroid.getInstance().logger.info(
            "app_started",
            mapOf("startup_path" to "application_on_create"),
        )
    }
}
