<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. Here is a summary of all changes made:

**New files created:**
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application class that initializes PostHog on app startup using `PostHogAndroid.setup()`, with lifecycle events, deep links, and screen view autocapture enabled.

**Modified files:**
- `app/build.gradle.kts` — Added the `com.posthog:posthog-android:3.+` dependency, enabled `buildConfig`, and added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties`.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the application class; added `android:label` to `NavActivity` for accurate screen view tracking.
- `local.properties` — PostHog API key and host written here (gitignored).
- `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` — Calls `PostHog.identify()` and captures `user_logged_in` on login; captures `user_logged_out` and calls `PostHog.reset()` on logout.
- `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` — Captures `chat_channel_selected` and `profile_viewed` events from the navigation drawer.
- `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` — Captures `message_sent` with channel name and message length properties.
- `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` — Captures `emoji_picker_opened`, `voice_recording_started`, `voice_recording_finished`, and `voice_recording_cancelled`.
- `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` — Captures `widget_added_to_home_screen` when the user adds the app widget.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message | `Conversation.kt` |
| `profile_viewed` | Fired when the user navigates to a profile screen | `NavActivity.kt` |
| `chat_channel_selected` | Fired when a user selects a chat channel from the drawer | `NavActivity.kt` |
| `emoji_picker_opened` | Fired when the user opens the emoji picker | `UserInput.kt` |
| `voice_recording_started` | Fired when the user starts a voice recording | `UserInput.kt` |
| `voice_recording_finished` | Fired when the user finishes a voice recording | `UserInput.kt` |
| `voice_recording_cancelled` | Fired when the user cancels a voice recording | `UserInput.kt` |
| `widget_added_to_home_screen` | Fired when the user adds the Jetchat widget to their home screen | `JetchatDrawer.kt` |

## Next steps

To build the "Analytics basics" dashboard in PostHog, navigate to your PostHog project and create a new dashboard. We recommend adding the following insights:

1. **Login funnel** — Funnel from `user_logged_in` → `message_sent` to measure how many users who log in go on to send a message.
2. **Daily active messaging** — Trend of `message_sent` events over time to track daily engagement.
3. **Channel popularity** — Breakdown of `chat_channel_selected` by `channel_name` property to see which channels attract the most traffic.
4. **Voice recording usage** — Trend of `voice_recording_started` vs `voice_recording_cancelled` to understand voice recording adoption and drop-off.
5. **User retention** — Retention analysis from `user_logged_in` returning to `message_sent` to understand how often users come back to chat.

Visit your PostHog project at https://us.i.posthog.com/project/2/dashboard to get started.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
