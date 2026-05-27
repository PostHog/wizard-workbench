<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. PostHog is initialized in a new `JetchatApplication` class and captures the five most business-critical user actions: login (with user identification), logout, message sending, channel navigation, and profile viewing.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Includes `username` property. Also calls `PostHog.identify()` to link future events to the user. | `MainViewModel.kt` |
| `user_logged_out` | Fired on logout. Calls `PostHog.reset()` to unlink the session. | `MainViewModel.kt` |
| `message_sent` | Fired when a chat message is sent. Includes `channel_name` and `message_length` properties. | `conversation/Conversation.kt` |
| `channel_opened` | Fired when a user navigates to a channel from the drawer. Includes `channel_name`. | `NavActivity.kt` |
| `profile_viewed` | Fired when a user views a profile (from drawer or message avatar click). Includes `user_id`. | `NavActivity.kt`, `conversation/ConversationFragment.kt` |

## Changes summary

- **`JetchatApplication.kt`** — New Application class. Initializes PostHog with API key and host from `BuildConfig`, enables lifecycle events, screen view capture, and automatic error tracking.
- **`AndroidManifest.xml`** — Registered `JetchatApplication` as the app's `android:name`; added `android:label` to `NavActivity` for screen view tracking.
- **`gradle/libs.versions.toml`** — Added `posthog = "3.+"` version and `posthog-android` library entry.
- **`app/build.gradle.kts`** — Added `posthog.android` dependency, `buildConfig = true` feature, and `BuildConfig` fields reading from `local.properties`.
- **`local.properties`** — Added `posthog.apiKey` and `posthog.host` (gitignored).
- **`MainViewModel.kt`** — `login()` now calls `PostHog.identify()` then `capture("user_logged_in")`. `logout()` calls `capture("user_logged_out")` and `PostHog.reset()`.
- **`conversation/Conversation.kt`** — `ConversationContent` captures `message_sent` with channel and message length on each send.
- **`NavActivity.kt`** — Captures `channel_opened` on drawer channel tap and `profile_viewed` on drawer profile tap.
- **`conversation/ConversationFragment.kt`** — Captures `profile_viewed` when a user clicks a message avatar.

## Next steps

We recommend building the following insights in PostHog to keep an eye on user behavior:

- **[Login trends](https://us.posthog.com/insights?insight=TRENDS)** — Plot `user_logged_in` over time to track daily/weekly active users.
- **[Message volume](https://us.posthog.com/insights?insight=TRENDS)** — Plot `message_sent` over time, broken down by `channel_name` to compare channel engagement.
- **[Login → Message funnel](https://us.posthog.com/insights?insight=FUNNELS)** — A 2-step funnel: `user_logged_in` → `message_sent`. Shows what fraction of users who log in actually send a message.
- **[Channel popularity](https://us.posthog.com/insights?insight=TRENDS)** — Plot `channel_opened` broken down by `channel_name`.
- **[User retention](https://us.posthog.com/insights?insight=RETENTION)** — Retention from `user_logged_in` returning to `message_sent`.

Visit your [PostHog dashboards](https://us.posthog.com/dashboards) to create the "Analytics basics" dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
