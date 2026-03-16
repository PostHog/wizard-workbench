<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The following changes were made:

- **Created** `JetchatApplication.kt` — new Application class that initializes PostHog on app startup using `PostHogAndroid.setup()`, with lifecycle events, screen views, and deep link capture enabled.
- **Updated** `AndroidManifest.xml` — registered `JetchatApplication` as the app's Application class and added `android:label` to `NavActivity` for accurate screen view tracking.
- **Updated** `app/build.gradle.kts` — added the `posthog-android:3.+` dependency, enabled `buildConfig`, and configured `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties`.
- **Updated** `MainViewModel.kt` — added `PostHog.identify()` on login (with username as distinct ID), `PostHog.capture("user logged in")`, `PostHog.capture("user logged out")`, and `PostHog.reset()` on logout.
- **Updated** `NavActivity.kt` — added `PostHog.capture("chat channel opened")` when a channel is selected from the drawer.
- **Updated** `Conversation.kt` — added `PostHog.capture("message sent")` with channel name property when a message is sent.
- **Updated** `ProfileFragment.kt` — added `PostHog.capture("profile viewed")` with user ID when a profile is opened.
- **Updated** `UserInput.kt` — added `PostHog.capture("emoji picker opened")` when the emoji panel is opened, `PostHog.capture("voice recording started")` and `PostHog.capture("voice recording cancelled")` for voice recording interactions.

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user successfully logs in | `MainViewModel.kt` |
| `user logged out` | Fired when a user logs out | `MainViewModel.kt` |
| `message sent` | Fired when a user sends a chat message | `Conversation.kt` |
| `profile viewed` | Fired when a user views a profile | `ProfileFragment.kt` |
| `chat channel opened` | Fired when a user opens a chat channel from the drawer | `NavActivity.kt` |
| `voice recording started` | Fired when a user starts recording a voice message | `UserInput.kt` |
| `voice recording cancelled` | Fired when a user cancels a voice recording | `UserInput.kt` |
| `emoji picker opened` | Fired when a user opens the emoji selector panel | `UserInput.kt` |

## Next steps

The PostHog API key configured for this environment does not have `dashboard:write` or `insight:write` scopes. To set up an **"Analytics basics"** dashboard manually, log in to PostHog and create the following insights:

1. **Login funnel** — Funnel insight: steps `user logged in` → `message sent` — tracks how many users who log in go on to send a message.
2. **Daily active chatters** — Trend insight: `message sent` unique users per day — shows your daily active users.
3. **Voice recording completion rate** — Trend insight: `voice recording started` vs `voice recording cancelled` — reveals how often users abandon voice recordings.
4. **Channel popularity** — Breakdown insight: `chat channel opened` broken down by `channel_name` property — shows which channels users visit most.
5. **Profile engagement** — Trend insight: `profile viewed` unique users — tracks social engagement with profiles.

Create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
