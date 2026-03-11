<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android application. The following changes were made:

1. **Dependency added** — `com.posthog:posthog-android:3.+` was added to `gradle/libs.versions.toml` and `app/build.gradle.kts`.
2. **BuildConfig fields** — `POSTHOG_API_KEY` and `POSTHOG_HOST` are read from `local.properties` at build time and exposed via `BuildConfig`, keeping secrets out of source code.
3. **Application class created** — `JetchatApp.kt` initialises the PostHog Android SDK on app startup with `captureApplicationLifecycleEvents = true` and `captureScreenViews = true`, enabling automatic session, app lifecycle, and screen tracking.
4. **AndroidManifest.xml updated** — Registered `JetchatApp` as the `android:name` of the `<application>` element so PostHog initialises before any Activity.
5. **User identity** — `MainViewModel.login()` calls `PostHog.identify()` with the username as `distinctId`, linking all future events to the user. `MainViewModel.logout()` calls `PostHog.reset()` to clear the identity.
6. **Custom events** — 8 events are captured across 5 files (see table below).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user logs in with their username | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when the user taps Logout in the drawer | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a chat message is sent; includes `channel` property | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `chat_channel_switched` | Fired when the user selects a different channel from the drawer; includes `channel` property | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a profile screen is opened; includes `user_id` property | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `emoji_inserted` | Fired when the user selects an emoji from the emoji picker; includes `emoji` property | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice_recording_started` | Fired when the user starts a voice recording | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice_recording_cancelled` | Fired when the user cancels a voice recording | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |

## Next steps

To explore your data in PostHog, create an "Analytics basics" dashboard with the following recommended insights:

1. **Login conversion funnel** — Funnel from `user_logged_in` → `message_sent` to measure how many users who log in also send a message.
2. **Daily active users** — Unique users who triggered `user_logged_in` over time (line chart by day).
3. **Messages sent per channel** — Breakdown of `message_sent` by the `channel` property to identify your most active channels.
4. **Churn signals** — Trend of `user_logged_out` events over time to monitor logout frequency.
5. **Feature engagement** — Stacked bar chart comparing `emoji_inserted` and `voice_recording_started` counts to understand which input features users prefer.

You can build these at: **https://us.posthog.com/project/2/insights/new**

And create the dashboard at: **https://us.posthog.com/project/2/dashboard/new**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
