<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Jetpack Compose) project. The following changes were made:

- **New `JetchatApplication.kt`**: Created an `Application` subclass that initializes the PostHog Android SDK on app startup, reading credentials from `BuildConfig` fields sourced from `local.properties`.
- **`AndroidManifest.xml`**: Registered `JetchatApplication` as the app's `Application` class (`android:name=".JetchatApplication"`) and added `android:label` to `NavActivity` for accurate screen view tracking.
- **`app/build.gradle.kts`**: Added the `com.posthog:posthog-android:3.+` dependency, enabled `buildConfig = true`, and added `buildConfigField` entries that read `posthog.apiKey` and `posthog.host` from `local.properties`.
- **`local.properties`**: Populated with `posthog.apiKey` and `posthog.host` values (gitignored).
- **`MainViewModel.kt`**: Added `PostHog.identify()` on login (using the username as distinct ID) and `PostHog.reset()` on logout, along with `user logged in` and `user logged out` capture events.
- **`NavActivity.kt`**: Added `chat channel selected` event when a user picks a chat channel from the drawer.
- **`conversation/Conversation.kt`**: Added `message sent` event with the channel name property inside the `onMessageSent` handler.
- **`profile/ProfileFragment.kt`**: Added `profile viewed` event with `user_id` property in `onAttach`.
- **`conversation/UserInput.kt`**: Added `emoji picker opened` event when the emoji selector is opened (guarded to avoid duplicate fires).

| Event Name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully logs in | `MainViewModel.kt` |
| `user logged out` | Fired when the user taps the logout option | `MainViewModel.kt` |
| `message sent` | Fired when a user sends a message in a conversation | `conversation/Conversation.kt` |
| `chat channel selected` | Fired when a user selects a chat channel from the drawer | `NavActivity.kt` |
| `profile viewed` | Fired when a user opens another user's profile | `profile/ProfileFragment.kt` |
| `emoji picker opened` | Fired when the user opens the emoji selector | `conversation/UserInput.kt` |

## Next steps

To build insights and a dashboard based on these events, visit your PostHog project and create an "Analytics basics" dashboard with insights such as:

- **Login Funnel**: `user logged in` → `message sent` (conversion funnel)
- **Daily Active Users**: trend of `message sent` events over time
- **Churn / Logout Rate**: trend of `user logged out` events
- **Channel Popularity**: `chat channel selected` broken down by `channel_name`
- **Profile Engagement**: trend of `profile viewed` events

You can create these at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
