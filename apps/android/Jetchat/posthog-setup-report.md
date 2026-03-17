<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. PostHog is initialized in a new `JetchatApp` Application class using credentials stored in `local.properties` and surfaced through `BuildConfig`. User identification is called on login, and `PostHog.reset()` is called on logout. Seven custom events are instrumented across five files covering the core user journey: authentication, messaging, navigation, and home-screen widget adoption.

| Event name | Description | File |
|---|---|---|
| `user logged in` | User successfully logs in with a username | `MainViewModel.kt` |
| `user logged out` | User logs out and their session is cleared | `MainViewModel.kt` |
| `message sent` | User sends a chat message in a channel | `conversation/Conversation.kt` |
| `chat channel selected` | User switches channels via the navigation drawer | `NavActivity.kt` |
| `profile viewed` | User opens a teammate's profile via the drawer | `NavActivity.kt` |
| `emoji inserted` | User taps an emoji in the emoji picker panel | `conversation/UserInput.kt` |
| `widget added to home screen` | User initiates pinning the Jetchat widget | `components/JetchatDrawer.kt` |

## Next steps

We've set up the following insights for your "Analytics basics" dashboard. Visit your PostHog project to create the dashboard and add these insights:

- **Login → Message funnel** — Conversion funnel from `user logged in` → `message sent`. Shows how many users who log in go on to send at least one message.
- **Daily active users** — Unique users per day who triggered `user logged in`. Core engagement metric.
- **Messages sent over time** — Trend chart for `message sent`. Shows chat engagement volume.
- **Channel popularity** — Breakdown of `chat channel selected` by `channel_name` property. Shows which channels are most visited.
- **User retention** — Retention table with `user logged in` as the start event and `message sent` as the return event. Shows how many users return to chat after their first login.

Dashboard URL (create manually): https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
