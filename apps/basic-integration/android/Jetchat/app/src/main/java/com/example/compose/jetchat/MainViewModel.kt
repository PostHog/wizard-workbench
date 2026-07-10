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
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

private const val DEFAULT_CHANNEL = "composers"

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

    fun identifyUser(username: String) {
        PostHogAnalytics.identify(username)
    }

    fun captureChatOpened(channel: String) {
        PostHogAnalytics.capture(
            event = "chat_opened",
            properties = mapOf("channel" to channel),
        )
    }

    fun captureProfileOpened(userId: String, source: String) {
        PostHogAnalytics.capture(
            event = "profile_opened",
            properties = mapOf(
                "profile_user_id" to userId,
                "source" to source,
            ),
        )
    }

    fun resetOpenDrawerAction() {
        _drawerShouldBeOpened.value = false
    }

    fun login(username: String, password: String) {
        // Fake auth: accept anything; password intentionally unused.
        _loggedInUsername.value = username
        PostHogAnalytics.identify(username)
        PostHogAnalytics.capture(
            event = "user_logged_in",
            properties = mapOf(
                "login_method" to "password",
                "has_password_input" to password.isNotBlank(),
            ),
        )
    }

    fun logout() {
        val username = _loggedInUsername.value
        PostHogAnalytics.capture(
            event = "user_logged_out",
            properties = mapOf(
                "had_active_session" to (username != null),
                "previous_channel" to DEFAULT_CHANNEL,
            ),
        )
        PostHogAnalytics.reset()
        _loggedInUsername.value = null
    }
}
