/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val token = BuildConfig.POSTHOG_PROJECT_TOKEN
        val host = BuildConfig.POSTHOG_HOST
        if (token == null || host == null) {
            if (BuildConfig.DEBUG) {
                error(
                    "${if (token == null) "POSTHOG_PROJECT_TOKEN" else "POSTHOG_HOST"} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${if (token == null) "POSTHOG_PROJECT_TOKEN" else "POSTHOG_HOST"} is configured",
                )
            }
            return
        }

        val config = PostHogAndroidConfig(apiKey = token, host = host).apply {
            errorTrackingConfig.autoCapture = true
        }
        PostHogAndroid.setup(this, config)
    }
}
