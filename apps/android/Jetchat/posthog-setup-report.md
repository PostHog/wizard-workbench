<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android (Kotlin) application. The PostHog Android SDK (`com.posthog:posthog-android:3.31.0`) was added as a dependency, a custom `Application` class was created to initialize the SDK using config values sourced from `local.properties` (never hardcoded), and event tracking was added to the key user-interaction points across the app.

| Event Name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully logs in. Calls `PostHog.identify()` with the username as distinct ID to begin attributed tracking. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user logged out` | Fired when a user logs out. Calls `PostHog.reset()` to clear the identity and super properties. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message sent` | Fired when the user sends a message. Includes `channel` property. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel selected` | Fired when the user selects a chat channel from the drawer. Includes `channel_id` property. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile viewed` | Fired when the user navigates to view another user's profile. Includes `profile_user_id` property. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |

## Changes summary

- **`gradle/libs.versions.toml`**: Added `posthog = "3.31.0"` version entry and `posthog-android` library alias.
- **`app/build.gradle.kts`**: Added `buildConfig = true` in `buildFeatures`, reads `local.properties` for PostHog keys, exposes them as `BuildConfig` fields, and adds `implementation(libs.posthog.android)` dependency.
- **`app/src/main/AndroidManifest.xml`**: Registered `JetchatApplication` as the custom `Application` class, added `android:label` to `NavActivity` for screen title tracking.
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`**: New `Application` subclass that initializes `PostHogAndroid` with API key and host from `BuildConfig`, with `captureApplicationLifecycleEvents`, `captureScreenViews`, and `captureDeepLinks` all enabled.
- **`app/src/main/java/com/example/compose/jetchat/MainViewModel.kt`**: Added `PostHog.identify()` + `user logged in` capture on login; `user logged out` capture + `PostHog.reset()` on logout.
- **`app/src/main/java/com/example/compose/jetchat/NavActivity.kt`**: Added `channel selected` capture on chat item click and `profile viewed` capture on profile item click.
- **`app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt`**: Added `message sent` capture inside the `onMessageSent` lambda.
- **`local.properties`**: Added `posthog.apiKey` and `posthog.host` keys (file is gitignored).

## Next steps

To create a PostHog "Analytics basics" dashboard with insights for this integration, log into PostHog and create insights for:

1. **Daily logins trend** — `user logged in` event count over time
2. **Messages sent trend** — `message sent` event count over time, broken down by `channel`
3. **Login → message sent funnel** — Funnel from `user logged in` → `message sent` to measure conversion
4. **Profile views** — `profile viewed` event count, broken down by `profile_user_id`
5. **Churn signal** — `user logged out` count over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
