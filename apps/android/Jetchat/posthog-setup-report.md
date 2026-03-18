<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Jetpack Compose) application. The integration includes:

- **SDK installation**: Added `com.posthog:posthog-android:3.+` dependency to `app/build.gradle.kts`
- **Configuration**: PostHog API key and host are read from `local.properties` via `BuildConfig` fields — secrets never touch source control
- **Application class**: Created `JetchatApplication.kt` which initializes PostHog in `onCreate()` with lifecycle event capture, deep link capture, and screen view capture enabled
- **AndroidManifest**: Registered `JetchatApplication` as the app's Application class and added `INTERNET` permission
- **User identification**: Users are identified with `PostHog.identify()` on login (in `MainViewModel`) and the session is reset on logout via `PostHog.reset()`
- **8 custom events** added across 6 files covering login/logout, messaging, navigation, and profile interactions

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when the user successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | Fired when the user explicitly logs out | `MainViewModel.kt` |
| `message_sent` | Fired when a message is sent in a conversation channel | `Conversation.kt` |
| `chat_channel_selected` | Fired when the user selects a chat channel from the navigation drawer | `NavActivity.kt` |
| `profile_viewed` | Fired when a user profile is opened (top of engagement funnel) | `ProfileFragment.kt` |
| `profile_action_tapped` | Fired when the FAB is tapped on a profile (message or edit) | `Profile.kt` |
| `emoji_selected` | Fired when the user selects an emoji from the emoji picker | `UserInput.kt` |
| `widget_pinned_to_home` | Fired when the user pins the Jetchat widget to their home screen | `JetchatDrawer.kt` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Login funnel** — Conversion from `user_logged_in` → `message_sent` → `profile_viewed` to understand onboarding engagement
2. **Message volume** — Trend of `message_sent` events over time, broken down by `channel` property
3. **Active users** — Daily/weekly unique users based on `user_logged_in` or `message_sent`
4. **Churn signal** — Trend of `user_logged_out` events; high rates may indicate friction
5. **Emoji engagement** — Breakdown of `emoji_selected` events to understand which emojis are most popular

Create your dashboard here: [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
