/*
 * Copyright 2024 The Android Open Source Project
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
import com.posthog.PostHog
import com.posthog.android.PostHogAndroid
import com.posthog.android.PostHogAndroidConfig

class PostHogApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val posthogApiKey = BuildConfig.POSTHOG_ANDROID_PUBLIC_KEY
        val posthogHost = BuildConfig.POSTHOG_ANDROID_HOST

        PostHogAndroid.setup(this, PostHogAndroidConfig(posthogApiKey, posthogHost))

        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            PostHog.capture(
                event = "\$exception",
                properties = mapOf(
                    "\$exception_message" to (throwable.message ?: ""),
                    "\$exception_type" to throwable.javaClass.name,
                    "\$exception_stack_trace" to throwable.stackTraceToString()
                )
            )
            PostHog.flush()
            defaultHandler?.uncaughtException(thread, throwable)
        }
    }
}
