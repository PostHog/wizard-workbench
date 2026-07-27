# PostHog setup report

PostHog Android product analytics and automatic error tracking were initialized, five user-action events were instrumented, and a starter dashboard was created.

## What was set up

- **SDK:** Added `com.posthog:posthog-android:3.+`; the review resolved it to version **3.56.3**.
- **Initialization:** `JetchatApplication` initializes PostHog once from `Application.onCreate()` using `BuildConfig.POSTHOG_PROJECT_TOKEN` and `BuildConfig.POSTHOG_HOST`. The app manifest registers the application, and activities have labels for screen tracking.
- **Configuration:** The variable names are documented in `.env.example`; real values were confirmed present in the project environment during the run. Missing configuration produces variable-specific debug errors while production remains a no-op.
- **Error tracking:** Automatic uncaught-exception capture is enabled with `errorTrackingConfig.autoCapture = true` in `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.

## Events instrumented

These events are defined in `.posthog-wizard-cache/.posthog-events.json` and are wired at the corresponding action handlers. The run did **not** launch the app or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A demo user submits valid nonblank credentials and enters the app. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `logout_completed` | A demo user explicitly signs out from the account drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `channel_selected` | A user selects a chat channel from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_opened` | A user opens a profile from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `message_sent` | A user sends a chat message; message content is excluded. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

Event properties exclude usernames, credentials, message bodies, and other user-entered PII. Captures currently rely on the SDK's anonymous device/session attribution.

## User identification

Identification was **skipped**. This demo accepts arbitrary usernames and has no authenticated account record, UUID, primary key, or other stable user identifier. No `identify()` or `reset()` calls were added. If real authentication is added, identify once after successful login with the stable account ID, put display information on the person rather than event properties, and reset on logout.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914209)

The dashboard contains five insights covering activity trends, chat engagement by channel, navigation engagement, a login-to-messaging funnel, and profile opens. The definitions use the instrumented event names and are configured for the last 30 days. The dashboard exists, but its data is unconfirmed until events are observed.

## What the run verified

- The PostHog Android dependency resolved successfully as `3.56.3`.
- Gradle configuration progressed after enabling `buildConfig` for the custom BuildConfig fields.
- Review confirmed one centralized setup call, callback-level capture locations, required manifest/activity labeling, and no PII event properties.
- The dashboard and five insight tiles were created successfully in project 483112.

## What the run did not verify

- No Android app build completed: `:app:assembleDebug` stopped before compilation because the environment had neither `ANDROID_HOME` nor `local.properties` with `sdk.dir`.
- No emulator/device launch occurred.
- No event delivery, anonymous distinct ID behavior, screen-view delivery, or error event arrival was observed.
- No runtime verification of the configured environment values reaching Gradle was performed beyond confirming the keys were present.

## Unresolved issues and cost of leaving them unresolved

- **Stable attribution is unresolved.** The app has no stable authenticated user ID, so events remain anonymous/device-session attributed. Until real authentication supplies and identifies a stable account ID, user-level funnels and retention may fragment across devices or sessions.
- **Runtime delivery is unresolved.** Because the app was not built or launched, the event pipeline and automatic error capture have not been proven to send data. The dashboard may remain empty until runtime verification is performed.

## Before you merge

- [ ] Run a full production Android build with an Android SDK configured (`ANDROID_HOME` or `local.properties` `sdk.dir`) and fix any integration-introduced compile, lint, or type errors; inspect `app/build.gradle.kts` and `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`.
- [ ] Run the test suite and update any mocks or fixtures affected by captures in `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` and `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every build/deploy environment, not only locally; verify the BuildConfig wiring in `app/build.gradle.kts`.
- [ ] Launch the app on an emulator or device, exercise login, logout, channel selection, profile opening, and message sending, and confirm the five events arrive in PostHog.
- [ ] If real authentication is introduced, replace anonymous attribution by wiring stable-ID `identify()` after login and `reset()` on logout in the authentication flow.
