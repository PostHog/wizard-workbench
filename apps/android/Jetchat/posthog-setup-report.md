<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The PostHog Android SDK (`posthog-android:3.+`) was added as a dependency, a new `JetchatApplication` class was created to initialize PostHog on app startup (reading API key and host from `local.properties` via `BuildConfig`), and the Application was registered in `AndroidManifest.xml`. Five key user events are now tracked across four files: user login with `identify()` to associate future events with the user, user logout with `reset()` to clear identity, message sends with channel context, channel selection from the drawer, and profile views with the viewed user's ID. Automatic events (app opened/closed, screen views, app install/update) are also captured by default.

| Event Name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user logs into the app. Also calls `identify()` to associate events with the user. | `MainViewModel.kt` |
| `user logged out` | Fired when a user logs out. Also calls `reset()` to clear stored identity. | `MainViewModel.kt` |
| `message sent` | Fired when a user sends a message; includes the `channel` name as a property. | `conversation/Conversation.kt` |
| `channel selected` | Fired when a user switches chat channels from the navigation drawer; includes `channel_name`. | `NavActivity.kt` |
| `profile viewed` | Fired when a user opens another user's profile screen; includes `profile_user_id`. | `profile/ProfileFragment.kt` |

## Next steps

To view your analytics, visit your PostHog project and create insights based on the events above:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- Suggested insights to build:
  - **Login funnel**: Conversion from app open → `user logged in`
  - **Message volume**: Trend of `message sent` over time, broken down by `channel`
  - **Active users**: Unique users who triggered `user logged in` vs `user logged out` (churn indicator)
  - **Channel popularity**: Breakdown of `channel selected` by `channel_name`
  - **Profile engagement**: Trend of `profile viewed` events over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
