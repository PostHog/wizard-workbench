<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin) application. The PostHog Android SDK has been added as a Gradle dependency and initialized in a new `JetchatApplication` class. Environment-based configuration reads the API key and host from `local.properties` via `BuildConfig` fields, so no secrets are hardcoded in source files. Nine meaningful analytics events covering the full user lifecycle — from login/logout, through messaging, emoji use, voice recording, channel navigation, and social profile interactions — have been instrumented across six files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; triggers `PostHog.identify()` to link events to the user | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out; triggers `PostHog.reset()` to clear the session | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a message in the conversation screen, with `channel` property | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |
| `channel_switched` | Fired when a user switches to a different chat channel via the drawer, with `channel` property | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a user navigates to a profile screen, with `user_id` property | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `profile_action_tapped` | Fired when the FAB is tapped on a profile screen, with `action` (`edit_profile` or `message`) and `user_id` | `app/src/main/java/com/example/compose/jetchat/profile/Profile.kt` |
| `emoji_inserted` | Fired when a user taps an emoji from the emoji selector, with `emoji` property | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `recording_started` | Fired when a user starts recording a voice message | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `recording_cancelled` | Fired when a user cancels a voice message recording | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |

## Next steps

We've designed the following insights and a dashboard for you to create in PostHog to monitor user behavior. Navigate to [PostHog → Dashboards → New dashboard](https://us.posthog.com/project/2/dashboard) and name it **"Analytics basics"**, then add these five insights:

1. **Daily active users (logins)** — Trend of `user_logged_in` events over time. Shows daily/weekly app engagement.
2. **Login → Message sent funnel** — Funnel: `user_logged_in` → `message_sent`. Reveals what fraction of logged-in users actually send a message (core activation metric).
3. **Churn signals: logout trend** — Trend of `user_logged_out` events. Spikes may indicate UX issues driving users away.
4. **Profile interaction funnel** — Funnel: `profile_viewed` → `profile_action_tapped`. Measures social interaction conversion from viewing a profile to taking action.
5. **Messaging engagement breakdown** — Bar chart comparing `message_sent`, `emoji_inserted`, `recording_started`, and `recording_cancelled` to understand how users communicate.

You can build each insight at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
