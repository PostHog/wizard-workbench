<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. The integration covers user identification on login, session reset on logout, and key user-action events throughout the app. The PostHog Android SDK is initialized in a new `JetchatApplication` class, registered in the Android manifest, and configured via `local.properties` so credentials are never hardcoded.

## Changes made

### New files
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes `PostHogAndroid` on startup using credentials from `BuildConfig`.

### Modified files
- `gradle/libs.versions.toml` — Added `posthog = "3.+"` version and `posthog-android` library entry.
- `app/build.gradle.kts` — Enabled `buildConfig`, added `buildConfigField` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST` (read from `local.properties`), and added the `posthog-android` dependency.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the `android:name` of `<application>`, and added `android:label` to `NavActivity` for accurate screen-view tracking.
- `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` — Added `user logged in` event with `PostHog.identify()` on login, `user logged out` event with `PostHog.reset()` on logout, and `channel opened` event when switching channels.
- `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` — Added `message sent` event with `channel_name` and `message_length` properties.
- `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` — Added `profile viewed` event with `user_id` property when a profile is opened.
- `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` — Added `emoji selected` event with `emoji` property when a user taps an emoji.

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `user logged in` | Fired when a user submits the login form. Identifies the user with PostHog. | `NavActivity.kt` |
| `user logged out` | Fired when a user taps the logout button. Resets the PostHog session. | `NavActivity.kt` |
| `channel opened` | Fired when a user switches to a chat channel from the drawer. | `NavActivity.kt` |
| `message sent` | Fired when a user sends a chat message. Captures `channel_name` and `message_length`. | `Conversation.kt` |
| `profile viewed` | Fired when a user navigates to a profile. Captures `user_id` of the viewed profile. | `ProfileFragment.kt` |
| `emoji selected` | Fired when a user taps an emoji in the emoji selector panel. Captures `emoji`. | `UserInput.kt` |

## Next steps

We've prepared insights you can build in PostHog to monitor user behavior based on the events just instrumented. Visit these links to create them in your project:

- **Login conversion funnel** — Track how many users who open the app successfully log in:
  [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

- **Daily active users (messages sent)** — Trend of `message sent` events over time to measure engagement:
  [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

- **Channel popularity** — Breakdown of `channel opened` by `channel_name` to see which channels are most active:
  [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

- **Profile engagement** — Count of `profile viewed` events, showing how often users explore profiles:
  [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

- **Emoji usage** — Breakdown of `emoji selected` by `emoji` to see which emojis are most popular:
  [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

You can collect all of these into a new **Analytics basics** dashboard:
[Create dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
