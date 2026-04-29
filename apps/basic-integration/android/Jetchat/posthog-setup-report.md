<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android application. Here's a summary of all changes made:

**New files created:**
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes the PostHog Android SDK on app startup using API key and host from `BuildConfig`.
- `local.properties` — Contains `posthog.apiKey` and `posthog.host` (gitignored).

**Modified files:**
- `app/build.gradle.kts` — Added `posthog-android:3.+` dependency, enabled `buildConfig`, and reads PostHog keys from `local.properties` into `BuildConfig` fields.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the app's `android:name`, and added `android:label` to `NavActivity` for accurate screen view tracking.
- `MainViewModel.kt` — Calls `PostHog.identify()` and captures `user logged in` on login; captures `user logged out` and calls `PostHog.reset()` on logout.
- `conversation/Conversation.kt` — Captures `message sent` with the channel name each time a user sends a message.
- `NavActivity.kt` — Captures `chat channel switched` with the target channel name when the user switches channels from the drawer.
- `profile/ProfileFragment.kt` — Captures `profile viewed` with the viewed user's ID when a profile screen is opened.

| Event | Description | File |
|---|---|---|
| `user logged in` | User successfully logs in; also calls `PostHog.identify()` to link the session to the user | `MainViewModel.kt` |
| `user logged out` | User logs out; also calls `PostHog.reset()` to clear the session | `MainViewModel.kt` |
| `message sent` | User sends a message in a chat channel; includes `channel` property | `conversation/Conversation.kt` |
| `chat channel switched` | User switches to a different chat channel from the drawer; includes `channel` property | `NavActivity.kt` |
| `profile viewed` | User navigates to a profile screen; includes `profile_user_id` property | `profile/ProfileFragment.kt` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog to monitor these events. Suggested insights:

1. **Login funnel** — Funnel from `user logged in` → `message sent` to measure activation rate
2. **Messages sent over time** — Trend of `message sent` events, broken down by `channel`
3. **Active users (DAU/WAU)** — Unique users triggering `user logged in` per day/week
4. **Channel popularity** — Bar chart of `chat channel switched` events grouped by `channel`
5. **Profile engagement** — Trend of `profile viewed` events to measure social feature usage

Create the dashboard here: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
