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

import com.posthog.android.PostHogAndroid

internal object PostHogLogs {
    fun applicationInitialized() = info("jetchat application initialized")

    fun demoLoginCompleted() = info("demo login completed")

    fun demoLogoutCompleted() = info("demo logout completed")

    fun messageSent(inputMethod: String) = info(
        "chat message sent",
        mapOf("input_method" to inputMethod),
    )

    private fun info(message: String, attributes: Map<String, Any> = emptyMap()) {
        PostHogAndroid.getInstance().logger.info(message, attributes)
    }
}
