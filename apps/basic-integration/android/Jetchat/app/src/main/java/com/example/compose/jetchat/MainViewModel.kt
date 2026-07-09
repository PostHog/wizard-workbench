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

import androidx.lifecycle.ViewModel
import com.posthog.PostHog
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Used to communicate between screens.
 */
class MainViewModel : ViewModel() {

    private val _drawerShouldBeOpened = MutableStateFlow(false)
    val drawerShouldBeOpened = _drawerShouldBeOpened.asStateFlow()

    // Dead-simple fake auth state for demo purposes.
    // Accepts any username/password, stores username in memory, and can be cleared via logout.
    private val _loggedInUsername = MutableStateFlow<String?>(null)
    val loggedInUsername = _loggedInUsername.asStateFlow()

    fun openDrawer() {
        _drawerShouldBeOpened.value = true
    }

    fun resetOpenDrawerAction() {
        _drawerShouldBeOpened.value = false
    }

    fun login(username: String, password: String) {
        // Fake auth: accept anything; password intentionally unused.
        val normalizedUsername = username.trim()
        _loggedInUsername.value = normalizedUsername

        PostHog.identify(
            distinctId = normalizedUsername,
            userProperties = mapOf(
                "username" to normalizedUsername,
                "authentication_state" to "logged_in",
            ),
        )
        PostHog.capture(
            event = "user_logged_in",
            properties = mapOf(
                "login_method" to "password",
                "username_length" to normalizedUsername.length,
            ),
        )
    }

    fun logout() {
        val username = _loggedInUsername.value
        if (username != null) {
            PostHog.capture(
                event = "user_logged_out",
                properties = mapOf(
                    "had_active_session" to true,
                    "username_length" to username.length,
                ),
            )
        }
        PostHog.reset()
        _loggedInUsername.value = null
    }
}
