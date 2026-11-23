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

import com.posthog.PostHog

internal object PostHogAppLog {
    fun loginCompleted() {
        PostHog.logger.info(
            "demo login completed",
            mapOf("action" to "login"),
        )
    }

    fun logoutCompleted() {
        PostHog.logger.info(
            "demo logout completed",
            mapOf("action" to "logout"),
        )
    }

    fun messageSent(inputMethod: String) {
        PostHog.logger.info(
            "message sent",
            mapOf(
                "action" to "message_send",
                "input_method" to inputMethod,
            ),
        )
    }
}
