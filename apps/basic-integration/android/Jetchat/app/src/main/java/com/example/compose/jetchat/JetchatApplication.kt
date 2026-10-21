/*
 * Copyright 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.compose.jetchat

import android.app.Application
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class JetchatApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        if (!isPostHogConfigured()) {
            if (BuildConfig.DEBUG) {
                val missingVariable = if (
                    BuildConfig.POSTHOG_API_KEY == "POSTHOG_API_KEY_NOT_CONFIGURED" ||
                    BuildConfig.POSTHOG_API_KEY.isBlank()
                ) {
                    "POSTHOG_API_KEY"
                } else {
                    "POSTHOG_HOST"
                }
                throw IllegalStateException(
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
                apiKey = BuildConfig.POSTHOG_API_KEY,
                host = BuildConfig.POSTHOG_HOST,
            ).apply {
                errorTrackingConfig.autoCapture = true
                logs.serviceName = "jetchat-android"
            },
        )
    }

    private fun isPostHogConfigured(): Boolean {
        return BuildConfig.POSTHOG_API_KEY.isNotBlank() &&
            BuildConfig.POSTHOG_API_KEY != "POSTHOG_API_KEY_NOT_CONFIGURED" &&
            BuildConfig.POSTHOG_HOST.isNotBlank() &&
            BuildConfig.POSTHOG_HOST != "POSTHOG_HOST_NOT_CONFIGURED"
    }
}
