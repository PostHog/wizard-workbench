<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. Here's a summary of all changes made:

## Changes made

### New files
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** — Application class that initializes PostHog with lifecycle events, deep link capture, and screen view tracking.

### Modified files
- **`app/build.gradle.kts`** — Added PostHog Android SDK dependency (`com.posthog:posthog-android`), enabled `buildConfig`, and added `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST` BuildConfig fields read from `local.properties`.
- **`gradle/libs.versions.toml`** — Added `posthog-android` library entry.
- **`local.properties`** — Added `posthog.apiKey` and `posthog.host` (gitignored).
- **`app/src/main/AndroidManifest.xml`** — Registered `JetchatApplication`, added `INTERNET` permission, and added `android:label` to the main activity.
- **`MainViewModel.kt`** — Added `PostHog.identify(username)` + `user_logged_in` on login; `user_logged_out` + `PostHog.reset()` on logout.
- **`Conversation.kt`** — Added `message_sent` event inside the `UserInput.onMessageSent` callback.
- **`NavActivity.kt`** — Added `channel_switched` event when the user picks a different channel from the drawer.
- **`ProfileFragment.kt`** — Added `profile_viewed` event in `onAttach`.
- **`Profile.kt`** — Added `profile_action_tapped` event when the profile FAB is clicked.
- **`UserInput.kt`** — Added `voice_recording_started`, `voice_recording_finished`, `voice_recording_cancelled` events on the record button callbacks; `emoji_inserted` when an emoji is tapped; and `attachment_attempted` (with `type` property) when photo, map, or video call buttons are tapped.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | User logs out | `MainViewModel.kt` |
| `message_sent` | User sends a message in a channel | `Conversation.kt` |
| `channel_switched` | User switches to a different chat channel | `NavActivity.kt` |
| `profile_viewed` | User navigates to a profile screen | `ProfileFragment.kt` |
| `profile_action_tapped` | User taps the profile action FAB (edit or message) | `Profile.kt` |
| `voice_recording_started` | User begins a voice message recording | `UserInput.kt` |
| `voice_recording_finished` | User completes a voice recording | `UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice recording by swiping | `UserInput.kt` |
| `emoji_inserted` | User inserts an emoji from the picker | `UserInput.kt` |
| `attachment_attempted` | User taps a photo/map/video attachment button | `UserInput.kt` |

## Next steps

We've prepared the foundation for insights and a dashboard. The PostHog API key currently lacks the `insight:write` and `dashboard:write` scopes needed to create them automatically. You can create them directly in PostHog:

- **[PostHog Dashboards](https://us.posthog.com/project/2/dashboard)** — Create a new dashboard named "Analytics basics (wizard)" and add the following insights:
  1. **User logins over time** — Trends on `user_logged_in` (daily, last 30 days)
  2. **Messages sent over time** — Trends on `message_sent` broken down by `channel`
  3. **Login → Message funnel** — Funnel from `user_logged_in` → `message_sent` (conversion rate)
  4. **Voice recording completion rate** — Trends comparing `voice_recording_started` vs `voice_recording_finished` and `voice_recording_cancelled`
  5. **Attachment feature adoption** — Trends on `attachment_attempted` broken down by `type`

- **[Create new insight](https://us.posthog.com/project/2/insights/new)** — Use this to manually build each insight above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
