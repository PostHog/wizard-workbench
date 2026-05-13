<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android app (Kotlin + Jetpack Compose). The integration covers SDK initialization, user identification, and event tracking across login, messaging, profile browsing, and channel navigation.

## Changes made

### New files
- `app/src/main/java/com/example/compose/jetchat/JetchatApp.kt` — Application class that initializes PostHog via `PostHogAndroid.setup()` on startup.

### Modified files
- `app/build.gradle.kts` — Added `posthog-android:3.+` dependency, `buildConfig = true`, and `buildConfigField` entries reading `posthog.apiKey` / `posthog.host` from `local.properties`.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApp` as the `android:name` application class.
- `local.properties` — PostHog API key and host written (gitignored).
- `MainViewModel.kt` — Added `PostHog.identify()` + `user_logged_in` capture on login; `PostHog.capture("user_logged_out")` + `PostHog.reset()` on logout.
- `conversation/Conversation.kt` — Added `message_sent` capture (with `channel` and `message_length` properties) inside `onMessageSent`.
- `profile/ProfileFragment.kt` — Added `profile_viewed` capture (with `profile_user_id`) in `onAttach`.
- `components/JetchatDrawer.kt` — Added `chat_channel_selected` capture (with `channel` property) for each chat item click.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User submits login form; triggers `PostHog.identify()` to link session to username | `MainViewModel.kt` |
| `user_logged_out` | User taps Logout; triggers `PostHog.reset()` to clear the identified user | `MainViewModel.kt` |
| `message_sent` | User sends a chat message; includes `channel` name and `message_length` | `conversation/Conversation.kt` |
| `profile_viewed` | User opens another user's profile; includes `profile_user_id` | `profile/ProfileFragment.kt` |
| `chat_channel_selected` | User switches to a different chat channel; includes `channel` name | `components/JetchatDrawer.kt` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor these events. Here are the suggested insights:

1. **Login funnel** — Conversion from `user_logged_in` → `message_sent` (do users send a message after logging in?)
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **Messages sent over time** — Trend of `message_sent` events, broken down by `channel`
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

3. **Daily active users** — Unique users firing any event per day (retention signal)
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

4. **Profile view rate** — Users who view a profile after sending a message (engagement depth)
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

5. **Logout / churn** — Trend of `user_logged_out` events over time
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

[Create your "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
