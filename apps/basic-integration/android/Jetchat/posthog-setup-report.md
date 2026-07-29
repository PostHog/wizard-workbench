# PostHog setup report

PostHog Android analytics was installed, initialized, and instrumented for six demo-app actions, with global uncaught-exception autocapture and a starter dashboard.

## What was installed and initialized

- Added `com.posthog:posthog-android:3.+`; dependency resolution verified the published version `3.56.6`.
- Added environment-backed `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` Gradle `BuildConfig` fields in `app/build.gradle.kts`; `.env.example` documents the key names and the configured `.env` contains both keys.
- Added one guarded `PostHogAndroid.setup()` initialization in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`, registered through `AndroidManifest.xml`.
- Capture call sites use the initialized Android singleton.

## Events instrumented

These are planned/instrumented events. The run did not launch the app or observe any event arriving in PostHog, so ingestion is **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor completes the demo login flow. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `logout_completed` | A visitor logs out from the demo chat experience. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `channel_selected` | A visitor selects a chat channel from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_selected` | A visitor opens a profile from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | A visitor sends a chat message through the composer. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `message_dropped` | A visitor adds a text message using drag and drop. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

The events are personless because the demo login accepts arbitrary credentials and does not expose a stable authenticated account ID. No user-entered username, message content, or profile identifier is included in event properties.

## User identification

Identification was skipped. `MainViewModel` only retains the fake demo username, which is not a stable, safe distinct ID. When real authentication exists, wire `PostHogAndroid.getInstance().identify(stableId, personProperties)` after successful login/registration and `reset()` during logout before clearing account state. Until then, event attribution remains anonymous/personless.

## Error tracking

`JetchatApplication.kt` enables `errorTrackingConfig.autoCapture = true` before SDK setup, configuring global SDK-provided uncaught-exception capture. The run did not launch the app or observe an error arriving in PostHog, so error ingestion is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924554) contains five attached insights covering login completions, messages sent, login-to-message conversion, navigation selections, and message composition methods. It is expected to remain empty until the Android app sends events.

## Verification and unresolved issues

- Gradle dependency resolution completed and resolved PostHog Android `3.56.6`.
- The attempted debug build advanced past the BuildConfig configuration error but could not complete because this environment has no configured Android SDK (`ANDROID_HOME`/`local.properties`). This is an environmental build conflict, not an integration error.
- The run did not launch the app, run the test suite, verify event delivery, verify error delivery, or prove production packaging.
- Gradle reads process environment variables; `.env` is not automatically loaded by this project. CI/release builds must export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

## Before you merge

- [ ] Run a full production Android build and fix any lint or compile errors introduced by the integration; inspect `app/build.gradle.kts` and the instrumented Kotlin files under `app/src/main/java/com/example/compose/jetchat/`.
- [ ] Run the test suite and update mocks or fixtures if needed; inspect tests covering `NavActivity.kt` and `conversation/Conversation.kt`.
- [ ] Export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every CI/release environment, not only local `.env`; verify the names in `.env.example` and `app/build.gradle.kts`.
- [ ] Launch the Android app and exercise each capture path in `NavActivity.kt` and `conversation/Conversation.kt`; confirm the six named events actually arrive in PostHog.
- [ ] Confirm uncaught-exception reporting from `JetchatApplication.kt` in a controlled non-production test.
- [ ] When real authentication replaces the demo login, add stable-ID `identify()` and logout `reset()` in the login/logout flow before relying on user-level attribution.
