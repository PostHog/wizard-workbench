# PostHog setup report

PostHog Android analytics was added with one application-level initialization, four event callsites, automatic error tracking, and a starter dashboard.

## What was installed and initialized

- Added the PostHog Android SDK dependency `com.posthog:posthog-android:3.+` in `app/build.gradle.kts`.
- Added BuildConfig-backed `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configuration, documented in `.env.example` and configured in the wizard environment.
- Added `JetchatApplication.kt`, registered it in `AndroidManifest.xml`, and configured a single `PostHogAndroid.setup()` call from `Application.onCreate()`.
- Enabled `buildFeatures.buildConfig` because the integration defines custom BuildConfig fields.
- Enabled SDK-managed uncaught exception/crash capture with `errorTrackingConfig.autoCapture = true` in `JetchatApplication.kt`.
- No CSP changes were applicable because this is a native Android application.

The review confirmed the expected source structure and four capture callsites. The run did **not** observe events arriving in PostHog, and it did not complete an Android build because the environment had no configured Android SDK.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_submitted` | A user successfully submits the demo login form. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `logout_completed` | A signed-in user completes logout from the account drawer. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `chat_message_sent` | A user sends a chat message, without sending message content. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile_opened` | A user opens a profile from a conversation. | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |

The review confirmed that message capture follows the local send operation and profile capture precedes profile navigation. No message content, username, password, or profile identifier is included in event properties.

## User identification

Identification was **skipped**. The demo authentication boundary stores only a mutable username and exposes no stable account ID, UUID, or other app-owned identifier. The username was not repurposed as a distinct ID. Until stable identity exists, events remain anonymous.

If stable identity is added later, wire `PostHog.identify(distinctId = stableUserId)` in `MainViewModel.login` after successful authentication and `PostHog.reset()` in `MainViewModel.logout` before clearing local identity. The run did not add or verify those calls.

## Error tracking

Global SDK-managed uncaught exception/crash capture was enabled in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` with `errorTrackingConfig.autoCapture = true`. The run verified the configuration edit, but did not run the app or observe an error arriving in PostHog.

## Dashboard

A dashboard named **Analytics basics (wizard)** was created with four tagged insights: login submissions, chat messages, profile opens, and a login-to-chat conversion funnel. The insights use the exact event names above and may initially be empty until Android events are ingested.

[DASHBOARD_URL] https://us.posthog.com/project/483112/dashboard/1919713

## Build status and conflicts

The initial Gradle attempt stopped because custom BuildConfig fields required `android.buildFeatures.buildConfig = true`. Review fixed that configuration issue in `app/build.gradle.kts`. A subsequent `./gradlew :app:assembleDebug` proceeded past the BuildConfig configuration failure but could not complete because this environment has no configured Android SDK: `SDK location not found`, requiring `ANDROID_HOME` or `local.properties` `sdk.dir`.

As a result, compilation, dependency resolution, and runtime event delivery remain unconfirmed. The `.env` keys are present, but Gradle reads process environment variables; local or CI builds must make `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` available to Gradle or use an approved Gradle-local configuration.

## Open issue to resolve

- **Stable user attribution is unresolved.** `MainViewModel.kt` has no stable authenticated user ID, so all four events and automatic error reports can remain anonymous and cannot be reliably tied to a returning account. Leaving this unresolved prevents account-level funnels and user-level error attribution; add a real stable ID at the authentication boundary before wiring `identify` and `reset`.

## Next steps

1. Configure an Android SDK via `ANDROID_HOME` or `local.properties` with `sdk.dir`, then run `./gradlew :app:assembleDebug` (or the project’s production build) and fix any compile or lint errors.
2. Provide `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the Gradle process in local and deployment environments; do not rely solely on the local `.env` file unless the build tooling loads it.
3. Run the app through login, chat send, profile open, and logout, then confirm the four named events arrive in PostHog and populate the dashboard. This was not observed during the wizard run.
4. Add a stable app-owned user ID to the authentication model, then identify on successful login and reset on logout.
5. Trigger a controlled test exception in a safe environment and confirm SDK error tracking arrives in PostHog.

## Before you merge

- [ ] Run a full production Android build and fix any lint, compile, or type errors introduced by the integration; the wizard could not complete a debug build because the Android SDK was unavailable.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented callsites in `MainViewModel.kt`, `Conversation.kt`, and `ConversationFragment.kt`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are documented in `.env.example` and set in every build/deploy environment, not just locally.
- [ ] In `MainViewModel.kt`, replace the missing identity boundary with a stable user ID before adding `identify` and `reset`, so authenticated events are attributable without using the username.
- [ ] Exercise the four callsites and verify event delivery in PostHog; a passing build alone does not prove capture.
