<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android application (Kotlin + Jetpack Compose). The integration includes SDK initialization, user identification, and event tracking across the core user flows.

## Summary of changes

- **`gradle/libs.versions.toml`** — Added `posthog = "3.+"` version entry and `posthog-android` library alias.
- **`app/build.gradle.kts`** — Added `posthog-android` dependency, enabled `buildConfig`, and added `POSTHOG_API_KEY` / `POSTHOG_HOST` `buildConfigField` entries read from `local.properties`.
- **`local.properties`** — Created with `posthog.apiKey` and `posthog.host` values (gitignored).
- **`app/src/main/AndroidManifest.xml`** — Registered `JetchatApplication` as the application class.
- **`JetchatApplication.kt`** _(new file)_ — Application class that calls `PostHogAndroid.setup()` in `onCreate()` with lifecycle, deep-link, and screen-view capture enabled.
- **`MainViewModel.kt`** — Added `PostHog.identify()` and `user_logged_in` capture on login; `user_logged_out` capture and `PostHog.reset()` on logout.
- **`NavActivity.kt`** — Added `channel_switched` capture when the user picks a channel from the drawer; `profile_viewed` capture when a user profile is opened.
- **`conversation/Conversation.kt`** — Added `onMessageSent` callback parameter to `ConversationContent` and wired it alongside the existing message-add logic.
- **`conversation/ConversationFragment.kt`** — Passes `onMessageSent` callback to `ConversationContent` that fires `message_sent` with channel name and message length.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Also calls `PostHog.identify()` to correlate events to the user. | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out. Calls `PostHog.reset()` to clear the identity. | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a message in a conversation channel. Includes `channel` and `message_length` properties. | `ConversationFragment.kt` |
| `channel_switched` | Fired when the user switches to a different chat channel via the navigation drawer. Includes `channel` property. | `NavActivity.kt` |
| `profile_viewed` | Fired when the user opens another user's profile. Includes `profile_user_id` property. | `NavActivity.kt` |

## Next steps

We've instrumented the key events in your Jetchat app. To complete your analytics setup, create a dashboard in PostHog with the following insights:

1. **Login funnel** — Funnel from `user_logged_in` → `message_sent` to measure onboarding engagement.
2. **Daily active messaging** — Trends chart for `message_sent` over time, broken down by `channel`.
3. **Channel popularity** — Trends chart for `channel_switched`, broken down by `channel` property.
4. **User retention** — Retention insight using `user_logged_in` as the cohort event and `message_sent` as the return event.
5. **Churn signal** — Trends chart comparing `user_logged_in` vs `user_logged_out` over time.

You can create this dashboard at [/dashboard/new](/dashboard/new) in your PostHog project.

> **Note:** Dashboard creation via the API requires `dashboard:write`, `insight:write`, and `query:read` scopes on your PostHog personal API key. The wizard's current key did not have these scopes, so the dashboard was not created automatically.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
