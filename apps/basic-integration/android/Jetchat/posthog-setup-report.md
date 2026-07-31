# PostHog setup report

PostHog Android analytics was added with anonymous demo login, logout, and chat-message events, global uncaught-error capture, and a starter dashboard.

## Installed and initialized

- Added `com.posthog:posthog-android:3.+` to `app/build.gradle.kts`.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` BuildConfig values sourced from environment variables, with the documented keys in `.env.example` and configured values present in the wizard-managed `.env`.
- Initialized PostHog once in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`, from the manifest-registered `JetchatApplication` in `app/src/main/AndroidManifest.xml`.
- Missing configuration is guarded: debug builds fail with variable-specific messages, while production remains a no-op when configuration is absent.
- The manifest also gives the activity an explicit label for screen-view attribution.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `demo_login_completed` | A user completes the demo login flow. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `demo_logout_completed` | A user logs out of the demo app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `chat_message_sent` | A user sends a chat message; only non-PII `message_length` is captured. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

The run verified that these capture calls are adjacent to the relevant successful state changes and that the event plan records the same names. It did not observe events arriving in PostHog; delivery remains unconfirmed.

## User identification

Identification was skipped. The demo authentication accepts an arbitrary username but exposes no stable account ID, UUID, or other approved identifier. The captures therefore remain anonymous and do not include the username. A future real authentication flow should expose a stable non-PII user ID, then wire identify after login and reset on logout.

### Unresolved issue: stable attribution

No stable authenticated identifier could be established in the current demo schema. If this remains unresolved, login, logout, and chat activity cannot be reliably attributed to returning users or consolidated across sessions. The affected call sites are the anonymous captures in `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt:48`, `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt:53`, and `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt:207`.

## Error tracking

Enabled `PostHogAndroidConfig.errorTrackingConfig.autoCapture = true` in `JetchatApplication.kt` for global uncaught-exception capture. No manual error-capture wrappers were added. The run verified the configuration statically but did not observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935573) contains four tiles: daily login completions, daily chat messages, daily logouts, and a 14-day login-to-chat funnel. The dashboard and insights were created successfully, but their data was not verified against ingested events during this run.

## Build and verification

The integration review ran `./gradlew :app:assembleDebug`. Gradle evaluated project configuration but stopped before compilation because the runtime has no Android SDK configured: `SDK location not found`, requiring `ANDROID_HOME` or `local.properties` with `sdk.dir`. Consequently, Kotlin compilation, dependency resolution completion, app launch, event delivery, and error delivery were not verified. No tests were run.

## Before you merge

- [ ] Run `./gradlew :app:assembleDebug` or the full production build in an environment with an Android SDK (`ANDROID_HOME` or `local.properties` `sdk.dir`) and fix any compilation or lint errors introduced by the integration; inspect `app/build.gradle.kts` and `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
- [ ] Run the test suite and update any mocks or fixtures affected by the captures in `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` and `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every deploy/build environment, not only locally; see `.env.example` and the BuildConfig declarations in `app/build.gradle.kts`.
- [ ] Launch the app with valid configuration, complete login, send a chat message, and log out; confirm `demo_login_completed`, `chat_message_sent`, and `demo_logout_completed` arrive in the intended PostHog project.
- [ ] Decide how the real authentication flow will provide a stable non-PII user ID, then add identify/reset around the login/logout flow before relying on user-level attribution; currently no identify call exists.
- [ ] Trigger a controlled uncaught exception in a safe test build and confirm error tracking arrives; the configuration is in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
