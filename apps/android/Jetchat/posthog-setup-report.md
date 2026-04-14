<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app (Jetpack Compose). Here's a summary of all changes made:

- **`app/build.gradle.kts`**: Added the `posthog-android:3.+` dependency, enabled `buildConfig`, and injected `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields read from `local.properties`.
- **`local.properties`**: Populated with `posthog.apiKey` and `posthog.host` (gitignored — values stay local).
- **`app/src/main/AndroidManifest.xml`**: Registered `JetchatApplication` as the application class and added `android:label` to `NavActivity` for accurate screen view tracking.
- **`app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt`** *(new)*: Application subclass that calls `PostHogAndroid.setup()` once on startup using `BuildConfig` values.
- **`MainViewModel.kt`**: On `login()`, calls `PostHog.identify()` with the username and captures `user logged in`. On `logout()`, captures `user logged out` then calls `PostHog.reset()` to clear identity.
- **`conversation/Conversation.kt`**: Captures `message sent` with the channel name when a user submits a message.
- **`NavActivity.kt`**: Captures `channel changed` (with channel name) when the user switches channels, and `profile viewed` (with profile user ID) when opening a profile.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired on successful login; also calls `identify()` to link the user | `MainViewModel.kt` |
| `user logged out` | Fired on logout; also calls `reset()` to clear PostHog identity | `MainViewModel.kt` |
| `message sent` | Fired when a user sends a chat message; includes `channel` property | `conversation/Conversation.kt` |
| `channel changed` | Fired when the user switches to a different chat channel; includes `channel` property | `NavActivity.kt` |
| `profile viewed` | Fired when the user opens a profile from the drawer; includes `profile_user_id` | `NavActivity.kt` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Daily active users** — Unique users with any event, trended over time
2. **Login → Message sent funnel** — `user logged in` → `message sent` conversion funnel to measure activation
3. **Messages sent per channel** — `message sent` broken down by `channel` property
4. **Logout / churn rate** — `user logged out` count over time
5. **Profile views** — `profile viewed` trended over time, broken down by `profile_user_id`

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
