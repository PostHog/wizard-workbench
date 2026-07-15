package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val config = PostHogAndroidConfig(
            apiKey = BuildConfig.POSTHOG_PROJECT_TOKEN,
            host = BuildConfig.POSTHOG_HOST,
        ).apply {
            captureApplicationLifecycleEvents = true
            captureDeepLinks = true
            captureScreenViews = true
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
    }
}
