# PostHog setup report

PostHog Android analytics was installed and initialized, three core app events were instrumented, error autocapture was enabled, and a starter dashboard was created.

## What was set up

- Added `implementation("com.posthog:posthog-android:3.+")` to `app/build.gradle.kts`.
- Added centralized initialization in `JetchatApplication.onCreate()` using the PostHog Android singleton, with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` supplied through BuildConfig fields.
- Registered `JetchatApplication` in `app/src/main/AndroidManifest.xml`.
- Documented the environment variable names in `.env.example`; the configured environment contains both keys. Gradle does not load local `.env` files automatically, so the variables must be exported to the Gradle process.
- Enabled `errorTrackingConfig.autoCapture = true` for uncaught application error tracking.
- No server-side library was added because this is an Android-only app.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A demo login is submitted and accepted. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `logout_completed` | The active demo session is ended from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | A chat message is sent in a conversation. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

The events use plain captures without event properties. The run deliberately did not send usernames, passwords, message content, or profile data as event properties.

The run verified the three capture call sites by inspection and confirmed that the dashboard definitions use the exact event names. It did **not** observe events arriving in PostHog, because the app was not launched and the build did not reach compilation.

## User identification

Identification was skipped. This demo has fake authentication and retains only an arbitrary, user-entered username in memory; it has no stable application-owned user ID, UUID, resource identifier, user record, or authentication backend. Using that username as a distinct ID would violate the stable-ID and PII requirements.

**Follow-up issue:** Until authentication supplies a stable non-PII user ID, the captured events remain personless and cannot be reliably attributed to returning users. When one becomes available, wire `identify(stableId, personProperties)` after successful login and `reset()` during logout at the boundaries inspected in `MainViewModel.login` and `NavActivity`.

## Error tracking

Global SDK error tracking was enabled centrally in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` with `errorTrackingConfig.autoCapture = true`. No manual error capture calls were added. The run did not launch the app or observe an error event.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902573)

The dashboard contains four wizard-tagged tiles: Login completions trend, Messages sent trend, Logouts over time trend, and Login to message funnel. The dashboard and insights are live, but are expected to remain empty until the Android app sends events.

## Build status and conflicts

The review ran `./gradlew :app:assembleDebug` three times after the relevant fixes. Each run reached Gradle configuration, and the earlier disabled custom BuildConfig error was resolved by enabling Android BuildConfig generation. The current build remains blocked **before compilation** because this checkout has no Android SDK location configured: neither `ANDROID_HOME` nor `local.properties` `sdk.dir` is available. This is an environmental conflict, not a failure caused by the integration. Consequently, compilation has not verified compatibility with the installed PostHog Android 3.x API, including `errorTrackingConfig.autoCapture`.

An earlier dependency check also stopped at the project's disabled BuildConfig feature with: `defaultConfig contains custom BuildConfig fields, but the feature is disabled`; that configuration issue was fixed during review.

## Next steps

1. Configure an Android SDK through `ANDROID_HOME` or `local.properties` `sdk.dir`, then run a full debug and production build.
2. Export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every build/deploy environment before Gradle runs; do not rely on a local `.env` file being loaded automatically.
3. Launch the app, exercise login, logout, and text-message sending, and confirm `login_completed`, `logout_completed`, and `message_sent` arrive in PostHog. Also verify uncaught error reporting in a controlled test build.
4. Add a stable non-PII account identifier when real authentication exists, then implement identify/reset at the login/logout boundaries.
5. Run the test suite and inspect any mocks or fixtures affected by the new SDK calls.

## Before you merge

- [ ] Configure `ANDROID_HOME` or `local.properties` `sdk.dir`, then run the full production build and fix any errors introduced by `app/build.gradle.kts` or `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
- [ ] Run the test suite and update mocks or fixtures for captures in `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` and `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in `.env.example` and set in each deployment environment before Gradle configuration.
- [ ] After launching the Android app, verify the three events arrive in PostHog; the run itself only verified call sites, not delivery.
- [ ] If real authentication is added, provide a stable non-PII user ID and wire identify/reset at the login/logout boundaries before relying on user-level attribution.
