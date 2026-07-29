# PostHog setup report

PostHog Android analytics was added to the Jetchat demo with environment-backed initialization, three privacy-safe event captures, global error tracking, and a starter dashboard.

## What was installed and initialized

- Added `com.posthog:posthog-android:3.+` to `app/build.gradle.kts`; Gradle resolved it to version `3.56.7` during the dependency check.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and configured the real values through the wizard-managed environment.
- Centralized one-time SDK setup in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`, called from `Application.onCreate()`, using BuildConfig values sourced from environment or the local wizard-managed `.env` fallback. Missing configuration is guarded: debug builds fail with precise configuration errors, while release builds no-op.
- Registered `JetchatApplication` in `app/src/main/AndroidManifest.xml`.

The run verified dependency resolution and inspected the changed integration files. It did **not** verify that events reached PostHog, because the app was not run with a usable Android SDK/build environment.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_completed` | Successful completion of the demo login action without collecting credentials or username. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `logout_completed` | An explicit account logout from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | A successfully submitted chat message with channel context, without message content. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

The capture step recorded these call sites and confirmed that event properties contain no message content, credentials, username, or other user-entered PII. The run did not observe any of these events arriving in PostHog.

## User identification

Identification was **skipped**. The demo login retains only a user-entered username, and no stable authenticated account ID or UUID reaches the login boundary. Using that username as a distinct ID would violate the analytics identity contract. The events therefore remain anonymous/personless. When real authentication supplies a stable user ID, wire `identify` after successful login and `reset` on logout; keep the username as a person property rather than an event property.

### Unresolved issue

The app has no stable authenticated identifier available at `MainViewModel.login`. Until that is resolved, analytics cannot reliably associate events with returning users or attribute activity to an account. This is an identity limitation of the demo, not a failed implementation step.

## Error tracking

Global uncaught-error capture was enabled through `errorTrackingConfig.autoCapture = true` in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`, before the single SDK setup call. This is configured to feed PostHog Error Tracking. The run did not trigger an exception or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926567)

The dashboard contains four live insights: daily `login_completed`, daily `message_sent`, daily `logout_completed`, and a 14-day ordered login-to-message funnel. The insights may initially be empty because event delivery was not verified during this run.

## Build and verification status

- The dependency verification command `./gradlew :app:dependencies` succeeded and resolved the PostHog Android SDK to `3.56.7`.
- Two `:app:assembleDebug` attempts reached Gradle dependency determination but could not continue because the runner has no Android SDK location: `ANDROID_HOME` is unset and `local.properties` is absent.
- The second build attempt included the review fixes; neither fix introduced an earlier Gradle configuration failure.
- The Gradle lint task was not run because the runtime command fence rejected `:app:spotlessCheck`; no lint result is available.
- No test suite was run, and no event delivery or error delivery was observed.

## Next steps

1. Provide an Android SDK through `ANDROID_HOME` or `local.properties` (`sdk.dir`) and run a full debug/production build.
2. Run the test suite and lint checks, then fix any integration errors.
3. Launch the app on a device or emulator, exercise login, message submission, and logout, and confirm `login_completed`, `message_sent`, and `logout_completed` arrive in PostHog.
4. Trigger a controlled test exception in a non-production environment and confirm it appears in PostHog Error Tracking.
5. If this app gains real authentication, pass a stable account ID into the login boundary and add `identify`/logout `reset` as described above.
6. Ensure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in every deploy/build environment, not only locally.

## Before you merge

- [ ] Run a full production build and fix any compile, lint, or type errors introduced by the integration; review `app/build.gradle.kts` and `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures. Pay particular attention to `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` and `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in CI/release environments, not just the local `.env`; review `.env.example` and `app/build.gradle.kts`.
- [ ] Exercise login, message submission, and logout on a device/emulator and verify the three events arrive in PostHog; review the capture call sites in `NavActivity.kt` and `conversation/Conversation.kt`.
- [ ] Trigger and verify a controlled uncaught error in a non-production build; review `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
