<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Kotlin/Jetpack Compose) application. The following changes were made:

- **Created `JetchatApplication.kt`**: New `Application` subclass that initializes the PostHog Android SDK on app startup using `PostHogAndroid.setup()`, reading credentials from `BuildConfig`.
- **Updated `AndroidManifest.xml`**: Registered `JetchatApplication` as the app's application class and added `android:label` to `NavActivity` for accurate screen view tracking.
- **Updated `app/build.gradle.kts`**: Added the `posthog-android:3.+` dependency, enabled `buildConfig`, and wired `posthog.apiKey` / `posthog.host` from `local.properties` into `BuildConfig` fields.
- **Updated `local.properties`**: Added `posthog.apiKey` and `posthog.host` (gitignored).
- **Updated `MainViewModel.kt`**: Added `PostHog.identify()` on login (associates events to the username), `PostHog.capture("user logged in")`, `PostHog.capture("user logged out")`, and `PostHog.reset()` on logout.
- **Updated `NavActivity.kt`**: Added `PostHog.capture("chat channel selected")` when a drawer channel is tapped, and `PostHog.capture("profile viewed")` when a profile is opened from the drawer.
- **Updated `Conversation.kt`**: Added `PostHog.capture("message sent")` with the channel name as a property whenever a user submits a message.

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user submits the login form | `MainViewModel.kt` |
| `user logged out` | Fired when the user taps Logout in the drawer | `MainViewModel.kt` |
| `message sent` | Fired when the user sends a chat message | `Conversation.kt` |
| `chat channel selected` | Fired when the user selects a chat channel from the drawer | `NavActivity.kt` |
| `profile viewed` | Fired when the user navigates to a profile screen | `NavActivity.kt` |

## Next steps

You can build insights and a dashboard in PostHog to monitor user behavior based on these events:

- [PostHog Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Insights — Trend: Daily logins](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"user logged in"}],"insight":"TRENDS"})
- [Insights — Trend: Messages sent per day](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"message sent"}],"insight":"TRENDS"})
- [Insights — Funnel: Login → Message sent](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"user logged in"},{"id":"message sent"}],"insight":"FUNNELS"})
- [Insights — Churn: Logout events](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"user logged out"}],"insight":"TRENDS"})
- [Insights — Channel popularity](https://us.posthog.com/project/238460/insights/new#{"events":[{"id":"chat channel selected"}],"breakdown":"channel","insight":"TRENDS"})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
