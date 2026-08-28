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

        if (!hasPostHogConfiguration()) return

        PostHogAndroid.setup(
            this,
            PostHogAndroidConfig(
                apiKey = BuildConfig.POSTHOG_PROJECT_TOKEN,
                host = BuildConfig.POSTHOG_HOST,
            ).apply {
                errorTrackingConfig.autoCapture = true
            },
        )
    }

    private fun hasPostHogConfiguration(): Boolean {
        val missingVariable = when {
            BuildConfig.POSTHOG_PROJECT_TOKEN.isBlank() -> "POSTHOG_PROJECT_TOKEN"
            BuildConfig.POSTHOG_HOST.isBlank() -> "POSTHOG_HOST"
            else -> return true
        }

        if (BuildConfig.DEBUG) {
            error(
                "$missingVariable variable required by PostHog is missing or un-configured, " +
                    "this causes events to be silently missed. This error stops appearing once " +
                    "$missingVariable is configured",
            )
        }

        return false
    }
}
