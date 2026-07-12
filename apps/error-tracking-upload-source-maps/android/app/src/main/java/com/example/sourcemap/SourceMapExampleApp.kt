package com.example.sourcemap

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class SourceMapExampleApp : Application() {
    override fun onCreate() {
        super.onCreate()

        val projectToken = System.getenv("POSTHOG_PROJECT_TOKEN") ?: "test_project_token"
        val host = System.getenv("POSTHOG_HOST") ?: "https://us.i.posthog.com"
        val config = PostHogAndroidConfig(projectToken, host).apply {
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
    }
}
