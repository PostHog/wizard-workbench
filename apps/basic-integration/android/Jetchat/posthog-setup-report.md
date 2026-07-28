# PostHog setup report

PostHog Android SDK instrumentation was added for app engagement, authentication-flow, messaging, navigation, widget-interest, and uncaught-error analytics.

## Verified by this run

- **Installed:** `com.posthog:posthog-android:3.+` in `app/build.gradle.kts`.
- **Initialized:** `PostHogApplication.onCreate()` performs one guarded `PostHogAndroid.setup()` call using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the process environment, falling back to the project `.env`. Debug builds fail loudly when either value is missing; release builds skip initialization. Configuration is documented in `.env.example`.
- **Events instrumented:** Seven custom events were added at real action handlers. Event properties do not include message contents, usernames, passwords, or profile identifiers.
- **User identification:** Skipped. The demo login accepts arbitrary credentials and exposes no stable non-PII account ID. No `DISTINCT_ID` placeholder was introduced. If real authentication later provides a stable ID, identify after login and reset on logout.
- **Error tracking:** SDK automatic uncaught-exception capture is enabled with `errorTrackingConfig.autoCapture = true` in `PostHogApplication.kt`.
- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918776), containing four tagged insights covering engagement, authentication, chat activation, and feature interaction.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_completed` | Demo user submits credentials and enters chat | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `logout_completed` | Demo user signs out from the drawer | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `chat_channel_opened` | User chooses a chat channel from navigation | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_opened` | User opens a profile from navigation | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | User sends a message without capturing its content | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `message_dropped` | User drops text into chat, creating a message without capturing its content | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `widget_add_requested` | User requests adding the chat widget to the home screen | `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` |

## Unresolved issues and limits

- **Build conflict:** `./gradlew assembleDebug` configured Gradle but could not compile because this environment has no Android SDK configured (`ANDROID_HOME` or `local.properties` `sdk.dir`). This is a verification failure, not evidence that the source compiles.
- **Runtime delivery is unconfirmed:** The app was not launched and no event was observed arriving in PostHog. Dashboard insights may remain empty until the instrumented paths are exercised.
- **Identity remains unresolved:** The client-only demo has no stable account identifier. Leaving this unresolved prevents reliable per-user attribution and means events remain personless. Do not replace it with the arbitrary username because that would violate the non-PII identity requirement.
- **Configuration delivery remains environment-dependent:** local Gradle builds rely on `.env` fallback, while CI/release must supply the two variables through its configured environment or equivalent `.env` mechanism.

## Before you merge

- [ ] Run a full production Android build and fix any lint or compilation errors introduced by the integration; inspect `app/build.gradle.kts` and `app/src/main/java/com/example/compose/jetchat/PostHogApplication.kt`.
- [ ] Run the test suite; inspect instrumented call sites in `app/src/main/java/com/example/compose/jetchat/NavActivity.kt`, `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`, and `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` if mocks or fixtures need updates.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in deploy environments, not only local `.env`; check the names in `.env.example` and the lookup in `app/build.gradle.kts`.
- [ ] Launch a debug or release build, exercise all seven actions, and confirm the corresponding events arrive in PostHog; the run itself did not verify delivery.
- [ ] If real authentication gains a stable non-PII account ID, wire `identify` after successful login and `reset` at logout in the authentication flow before relying on user-level attribution.
