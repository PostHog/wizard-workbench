# PostHog setup report

PostHog Android analytics was installed, initialized in the application lifecycle, instrumented for login, logout, and message sending, connected to a starter dashboard, and configured for automatic uncaught-exception reporting.

## Installed and initialized

- Installed `com.posthog:posthog-android:3.+`; Gradle resolved it to version `3.56.4`.
- PostHog is initialized once in `JetchatApplication.onCreate()` through `PostHogAndroid.setup()`.
- The project token and host are supplied through `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the local `.env` contains both keys and is ignored by Git. `.env.example` documents the configuration names with non-secret placeholders.
- Missing configuration is guarded according to the Android integration rules: debug builds fail loudly and production builds remain a no-op.
- No CSP changes were needed because this is a native Android application.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user submits the demo login form and enters the chat experience. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `user_logged_out` | A user selects Logout from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | A user sends a non-empty chat message from the conversation composer; the event includes the non-PII `channel_name` property. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

These events were verified in the source and event plan. The run did **not** observe events arriving in PostHog, so event delivery and populated dashboard results remain unconfirmed.

## User identification

Identification was skipped. The demo login accepts arbitrary usernames and has no stable account ID, UUID, or equivalent identifier. Using the entered username as a distinct ID would violate the identity contract. Consequently, the three instrumented events are deliberately personless.

### Follow-up issue: no stable identity

A stable authenticated user identifier remains unresolved at the authentication boundary. If left unresolved, events cannot be reliably attributed to returning users or associated with a person across sessions. When real authentication supplies a stable ID, wire `PostHogAndroid.identify` after successful login and `PostHogAndroid.reset` during logout. No `DISTINCT_ID` placeholder was introduced at any call site.

## Error tracking

Global uncaught-exception capture was enabled with `errorTrackingConfig.autoCapture = true` in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`. No manual exception handlers were added. The run verified the configuration edit, but did not launch the app or observe an error arrive in PostHog Error Tracking.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918210)

The dashboard contains four live definitions: daily user logins, daily messages sent, daily user logouts, and an ordered login-to-message conversion funnel. The dashboard and its four tiles were created successfully, but they may remain empty until the Android app sends its first events.

## Build and verification status

- `./gradlew :app:dependencies` completed successfully and confirmed the PostHog SDK resolution.
- `./gradlew :app:assembleDebug` could not start because this runtime has no Android SDK path configured (`ANDROID_HOME`/`sdk.dir` is absent). This is an environment limitation, not a reported integration compilation error.
- No test suite was run.
- No app launch or live PostHog delivery verification was performed.

## Next steps

1. Provide `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to Android Studio/Gradle and CI or release environments, not only the local ignored `.env`.
2. Add a stable user ID to the real authentication model, then implement identify/reset at the login/logout boundary.
3. Run the app, exercise login, logout, and non-empty message sending, and confirm the three events arrive in PostHog.
4. Trigger a controlled uncaught exception in a non-production test environment and confirm it appears in Error Tracking.
5. Open the dashboard and confirm its tiles populate with the expected events.

## Before you merge

- [ ] Run a full production Android build and fix any lint or compilation errors introduced by the integration; the wizard could not run `assembleDebug` because `ANDROID_HOME`/`sdk.dir` is absent in its runtime.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example` and configured in every deploy/build environment, including Android Studio and CI.
- [ ] Launch the app and exercise `NavActivity.kt` login/logout handlers and `Conversation.kt` message sending, then verify `user_logged_in`, `user_logged_out`, and `message_sent` arrive in PostHog.
- [ ] Decide how the real authentication model supplies a stable user ID, then update the login/logout boundary before relying on person-level attribution.
- [ ] Trigger and verify an uncaught exception from `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`'s configured error-tracking path in a safe test environment.
