package com.example.compose.jetchat

import android.app.Application
import android.util.Log
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val apiKey = BuildConfig.POSTHOG_PROJECT_TOKEN
        val host = BuildConfig.POSTHOG_HOST
        if (apiKey.isBlank() || host.isBlank()) {
            if (BuildConfig.DEBUG) {
                error("POSTHOG_PROJECT_TOKEN and POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once they are configured")
            } else {
                Log.w("JetchatApplication", "PostHog is not configured; analytics disabled")
            }
            return
        }

        val config = PostHogAndroidConfig(apiKey = apiKey, host = host).apply {
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
    }
}
