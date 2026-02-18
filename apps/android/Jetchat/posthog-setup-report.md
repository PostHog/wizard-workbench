<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Jetchat** Android (Kotlin/Jetpack Compose) application. Here's a summary of what was done:

- **SDK dependency** added to `gradle/libs.versions.toml` and `app/build.gradle.kts` using the version catalog pattern already in use by the project.
- **Environment variables** (`posthog.apiKey`, `posthog.host`) written to `local.properties` and exposed as `BuildConfig` fields — no secrets are hardcoded.
- **Application class** `JetchatApplication.kt` created to initialize PostHog once at app startup, with lifecycle event capture, screen view tracking, deep link capture, and automatic error/crash tracking enabled.
- **AndroidManifest.xml** updated to register `JetchatApplication` as the application class.
- **User identity** is established on login via `PostHog.identify()` and cleared on logout via `PostHog.reset()`.
- **10 custom events** instrumented across 4 files covering authentication, messaging, navigation, and media interactions.

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully logs in with a username | `MainViewModel.kt` |
| `user logged out` | Fired when a user logs out from the app | `MainViewModel.kt` |
| `drawer opened` | Fired when the navigation drawer is opened | `MainViewModel.kt` |
| `conversation opened` | Fired when the user opens a conversation channel from the drawer | `NavActivity.kt` |
| `profile viewed` | Fired when the user navigates to a user's profile page | `NavActivity.kt` |
| `message sent` | Fired when a user sends a chat message (props: `channel`, `message_length`) | `Conversation.kt` |
| `emoji selected` | Fired when a user selects an emoji to add to their message (props: `emoji`) | `UserInput.kt` |
| `attachment selector opened` | Fired when the user taps an input selector button (props: `selector_type`) | `UserInput.kt` |
| `voice recording started` | Fired when a user begins recording a voice message | `UserInput.kt` |
| `voice recording finished` | Fired when a user finishes recording a voice message | `UserInput.kt` |

## Next steps

We've set up PostHog to automatically capture lifecycle events, screen views, deep links, and crashes in addition to the custom events above. Head to your PostHog project to start exploring the data:

- **PostHog project**: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)
- **Events explorer**: [https://us.posthog.com/project/238460/activity/explore](https://us.posthog.com/project/238460/activity/explore)
- **Create a dashboard**: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Suggested "Analytics basics" dashboard insights

Create a new dashboard named **"Analytics basics"** and add these five insights:

1. **Login & Logout Trends** — Trend of `user logged in` and `user logged out` over time (line graph, last 30 days). Highlights daily active users and churn signals.
2. **Message Activity** — Trend of `message sent` grouped by `channel` property. Shows which channels are most active.
3. **Login → Message Sent Funnel** — Funnel from `user logged in` → `message sent`. Measures how many users who log in actually engage with messaging.
4. **Feature Engagement** — Trend of `emoji selected`, `attachment selector opened`, and `voice recording started` over time. Shows which rich-media features are being adopted.
5. **Session Depth** — Average number of `message sent` events per user per session. Indicates conversation depth and engagement quality.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
