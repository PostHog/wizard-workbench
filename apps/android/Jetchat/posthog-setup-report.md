<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The PostHog Android SDK (`posthog-android:3.+`) has been added as a dependency, a new `JetchatApplication` class initializes the SDK on startup using environment-backed `BuildConfig` fields, and six meaningful business events have been instrumented across key user flows. User identification is performed on login via `PostHog.identify()` and session state is cleared on logout via `PostHog.reset()`.

| Event | Description | File |
|---|---|---|
| `user logged in` | Fired when a user submits the login form and is authenticated | `MainViewModel.kt` |
| `user logged out` | Fired when the user taps Logout from the drawer | `MainViewModel.kt` |
| `message sent` | Fired when a user sends a message in a chat channel | `conversation/Conversation.kt` |
| `profile viewed` | Fired when a user navigates to a profile screen | `profile/ProfileFragment.kt` |
| `chat channel switched` | Fired when the user selects a different chat channel from the drawer | `components/JetchatDrawer.kt` |
| `emoji inserted` | Fired when the user taps an emoji from the emoji selector | `conversation/UserInput.kt` |

## Next steps

We've suggested the following insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. You can create them directly in PostHog:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)** — then add the following insights:
  - **[Logins over time](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlciBsb2dnZWQgaW4iLCJ0eXBlIjoiZXZlbnRzIn1dLCJpbnNpZ2h0IjoiVFJFTkRTIn0=)** — trend of `user logged in` events to track daily/weekly active sign-ins
  - **[Messages sent over time](https://us.posthog.com/project/2/insights/new)** — trend of `message sent` events to measure core engagement
  - **[Login → Message conversion funnel](https://us.posthog.com/project/2/insights/new)** — funnel from `user logged in` → `message sent` to measure activation rate
  - **[Profile views over time](https://us.posthog.com/project/2/insights/new)** — trend of `profile viewed` to track social engagement
  - **[Emoji usage](https://us.posthog.com/project/2/insights/new)** — trend of `emoji inserted` to monitor feature adoption

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
