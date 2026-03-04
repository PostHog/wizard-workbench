<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The integration includes SDK setup, user identification, custom event tracking across all key user flows, and automatic lifecycle/screen-view capture.

## Changes made

### New files
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** — Custom `Application` class that initializes the PostHog Android SDK on app startup with lifecycle, screen view, and deep link capture enabled.

### Modified files
- **`app/build.gradle.kts`** — Added `com.posthog:posthog-android:3.+` dependency, enabled `buildConfig`, and injected `POSTHOG_API_KEY` / `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties`.
- **`app/src/main/AndroidManifest.xml`** — Registered `JetchatApplication` as the application class; added `android:label` to `NavActivity` for accurate screen view tracking.
- **`local.properties`** — Added `posthog.apiKey` and `posthog.host` (gitignored; never committed).

### Event tracking added

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in. Triggers `PostHog.identify()` to associate future events with the user. | `MainViewModel.kt` |
| `user_logged_out` | User logs out. Triggers `PostHog.reset()` to clear the identity. | `MainViewModel.kt` |
| `message_sent` | User sends a message in a conversation channel. Includes `channel` property. | `conversation/Conversation.kt` |
| `profile_viewed` | User navigates to a profile screen. Includes `viewed_user_id` and `is_own_profile` properties. | `profile/ProfileViewModel.kt` |
| `chat_channel_switched` | User switches to a different chat channel from the drawer. Includes `channel` property. | `NavActivity.kt` |
| `widget_added` | User pins the Jetchat widget to their home screen. | `components/JetchatDrawer.kt` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Login trend** — Trend of `user_logged_in` events over time (daily/weekly)
2. **Messages sent by channel** — Breakdown of `message_sent` by the `channel` property
3. **Login → Message sent funnel** — Conversion funnel from `user_logged_in` to `message_sent`
4. **Profile views** — Trend of `profile_viewed` events, broken down by `is_own_profile`
5. **User churn rate** — Ratio of `user_logged_out` to `user_logged_in` events over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
