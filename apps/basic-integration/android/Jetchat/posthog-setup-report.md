<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android application. Here is a summary of all changes made:

- **`JetchatApplication.kt`** (new file): A custom `Application` class that initializes the PostHog Android SDK on app startup using API key and host values read securely from `BuildConfig` fields.
- **`AndroidManifest.xml`**: Registered `JetchatApplication` as the app's `android:name`, and added `android:label` to `NavActivity` for accurate screen tracking.
- **`app/build.gradle.kts`**: Added the `posthog-android:3.+` dependency, enabled `buildConfig`, and added `POSTHOG_API_KEY` and `POSTHOG_HOST` as `BuildConfig` fields sourced from `local.properties`.
- **`local.properties`**: PostHog API key and host stored securely (gitignored).
- **`MainViewModel.kt`**: Added `PostHog.identify()` and `user logged in` capture on login; `user logged out` capture and `PostHog.reset()` on logout.
- **`Conversation.kt`**: Added `message sent` capture inside `UserInput`'s `onMessageSent` callback, with `channel_name` property.
- **`ConversationFragment.kt`**: Added `conversation viewed` capture in `onResume()` with `channel_name` property.
- **`ProfileFragment.kt`**: Added `profile viewed` capture in `onAttach()` with `profile_user_id` property.

| Event | Description | File |
|---|---|---|
| `user logged in` | User successfully logs in to the app | `MainViewModel.kt` |
| `user logged out` | User logs out of the app | `MainViewModel.kt` |
| `message sent` | User sends a message in a conversation channel | `Conversation.kt` |
| `profile viewed` | User views another user's profile | `ProfileFragment.kt` |
| `conversation viewed` | User opens and views a conversation channel (top of engagement funnel) | `ConversationFragment.kt` |

## Next steps

We've prepared insights for you to monitor user behavior based on the events just instrumented. Open each link to load and save them to your **Analytics basics** dashboard:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)
- [Engagement Funnel (login → conversation → message)](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22FunnelsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22user%20logged%20in%22%2C%20%22name%22%3A%20%22user%20logged%20in%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22conversation%20viewed%22%2C%20%22name%22%3A%20%22conversation%20viewed%22%7D%2C%20%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22message%20sent%22%2C%20%22name%22%3A%20%22message%20sent%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%7D%7D)
- [Daily Logins trend](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22user%20logged%20in%22%2C%20%22name%22%3A%20%22user%20logged%20in%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%7D%7D)
- [Message Send Volume trend](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22message%20sent%22%2C%20%22name%22%3A%20%22message%20sent%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%7D%7D)
- [User Retention (login → message sent)](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22RetentionQuery%22%2C%20%22retentionFilter%22%3A%20%7B%22targetEntity%22%3A%20%7B%22id%22%3A%20%22user%20logged%20in%22%2C%20%22type%22%3A%20%22events%22%7D%2C%20%22returningEntity%22%3A%20%7B%22id%22%3A%20%22message%20sent%22%2C%20%22type%22%3A%20%22events%22%7D%7D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%7D%7D)
- [Profile Views trend](https://us.posthog.com/project/2/insights/new?q=%7B%22kind%22%3A%20%22InsightVizNode%22%2C%20%22source%22%3A%20%7B%22kind%22%3A%20%22TrendsQuery%22%2C%20%22series%22%3A%20%5B%7B%22kind%22%3A%20%22EventsNode%22%2C%20%22event%22%3A%20%22profile%20viewed%22%2C%20%22name%22%3A%20%22profile%20viewed%22%7D%5D%2C%20%22dateRange%22%3A%20%7B%22date_from%22%3A%20%22-30d%22%7D%7D%7D)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
