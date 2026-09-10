package com.posthog.sourcemapexample

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class SourceMapExampleApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val config = PostHogAndroidConfig(
            apiKey = "phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA",
            host = "https://internal-c.posthog.com",
        )
        PostHogAndroid.setup(this, config)
    }
}
