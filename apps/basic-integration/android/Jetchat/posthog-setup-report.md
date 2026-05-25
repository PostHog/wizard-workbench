<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. Here is a summary of all changes made:

- **`JetchatApp.kt`** (new file): Application class that initializes PostHog on startup using `PostHogAndroid.setup()`. Configuration is read from `BuildConfig` fields sourced from `local.properties` (gitignored). Auto-captures lifecycle events, screen views, and exceptions.
- **`AndroidManifest.xml`**: Registered `JetchatApp` as the Application class. Added `android:label` to `NavActivity` to enable accurate screen view tracking.
- **`app/build.gradle.kts`**: Added `com.posthog:posthog-android:3.+` dependency, enabled `buildConfig = true`, and injected `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties`.
- **`local.properties`**: Added `posthog.apiKey` and `posthog.host` keys (gitignored — values never committed).
- **`MainViewModel.kt`**: Added `PostHog.identify()` and `PostHog.capture("user_logged_in")` on login; `PostHog.capture("user_logged_out")` and `PostHog.reset()` on logout.
- **`conversation/Conversation.kt`**: Added `PostHog.capture("message_sent")` when a user sends a message (with `channel` and `message_length` properties), and `PostHog.capture("message_link_opened")` when a user taps a hyperlink in chat.
- **`conversation/RecordButton.kt`**: Added `PostHog.capture("voice_recording_started")` when long-press starts, `PostHog.capture("voice_recording_completed")` when released, and `PostHog.capture("voice_recording_cancelled")` when cancelled (either by drag cancel or swipe-to-cancel gesture).
- **`conversation/UserInput.kt`**: Added `PostHog.capture("emoji_inserted")` when a user selects an emoji from the emoji selector panel.
- **`profile/ProfileFragment.kt`**: Added `PostHog.capture("profile_viewed")` with the viewed user's ID when a profile screen is opened.
- **`NavActivity.kt`**: Added `PostHog.capture("channel_switched")` when the user picks a different channel from the navigation drawer.
- **`components/JetchatDrawer.kt`**: Added `PostHog.capture("widget_added_to_home_screen")` when a user pins the Jetchat widget to their home screen.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a text message in a channel | `conversation/Conversation.kt` |
| `message_link_opened` | Fired when a user taps a hyperlink inside a chat message | `conversation/Conversation.kt` |
| `voice_recording_started` | Fired when a user begins a voice message recording | `conversation/RecordButton.kt` |
| `voice_recording_completed` | Fired when a user finishes a voice recording | `conversation/RecordButton.kt` |
| `voice_recording_cancelled` | Fired when a user cancels a voice recording | `conversation/RecordButton.kt` |
| `emoji_inserted` | Fired when a user selects an emoji from the emoji panel | `conversation/UserInput.kt` |
| `profile_viewed` | Fired when a user opens another user's profile screen | `profile/ProfileFragment.kt` |
| `channel_switched` | Fired when a user switches to a different chat channel | `NavActivity.kt` |
| `widget_added_to_home_screen` | Fired when a user pins the Jetchat widget to their home screen | `components/JetchatDrawer.kt` |

## Next steps

To explore your analytics, visit your [PostHog project](https://us.posthog.com/project/2) and create a dashboard with insights like:

- **Messaging funnel** — `user_logged_in` → `message_sent` to see how many users who log in go on to send a message
- **Message send trend** — Trend of `message_sent` over time, broken down by `channel`
- **Voice recording adoption** — Compare `voice_recording_started` vs `voice_recording_completed` vs `voice_recording_cancelled` to measure drop-off
- **Profile engagement** — Trend of `profile_viewed` events to track user interest in colleague profiles
- **Channel distribution** — `channel_switched` event broken down by `channel` property to see which channels are most popular
- **Widget adoption** — Trend of `widget_added_to_home_screen` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
