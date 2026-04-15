<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The PostHog Android SDK (`posthog-android:3.+`) was added to the app's Gradle dependencies. A new `JetchatApplication` class was created to initialize PostHog on app startup, using API key and host values read from `local.properties` via `BuildConfig` fields. The `AndroidManifest.xml` was updated to register this Application class and add an `android:label` to `NavActivity` for accurate screen view tracking. Event tracking was added across key user flows: authentication (login/logout with PostHog `identify` and `reset`), messaging (message sent with channel name and length), navigation (chat channel opened from the drawer), profile viewing, emoji insertion, and voice recording initiation.

| Event | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully logs in. Calls `PostHog.identify()` with the username, then captures the event. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user logged out` | Fired when a user logs out. Captures the event then calls `PostHog.reset()` to clear the user identity. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message sent` | Fired when a user sends a chat message. Includes `channel_name` and `message_length` properties. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile viewed` | Fired when a user navigates to a profile screen. Includes `profile_user_id` property. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `chat channel opened` | Fired when a user opens a chat channel from the navigation drawer. Includes `channel_name` property. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `emoji inserted` | Fired when a user selects and inserts an emoji into the message input. Includes the `emoji` character as a property. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice recording started` | Fired when a user begins recording a voice message. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |

## Next steps

To monitor user behavior based on the events just instrumented, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

- **Login funnel**: Funnel from `user logged in` → `message sent` — tracks how many users send a message after logging in.
- **Messages sent over time**: Trend of `message sent` events — shows overall engagement.
- **Unique active users**: Count of unique users who triggered `message sent` per day/week.
- **Profile views**: Trend of `profile viewed` — shows social discovery behavior.
- **Chat channel popularity**: Breakdown of `chat channel opened` by `channel_name` property — reveals which channels are most popular.

Create your dashboard here: https://us.i.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
