# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. A new `JetchatApplication` class was created to initialize the PostHog Android SDK on app startup, with keys loaded from `local.properties` via `BuildConfig`. Event tracking was added across five key files covering the full user journey: login/logout with user identification, message sending, channel switching, profile views, emoji and voice message interactions, attachment selector usage, and home-screen widget requests. User identification is called on every login so PostHog can correlate anonymous sessions to known users.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in with a username and password. | `MainViewModel.kt` |
| `user_logged_out` | User explicitly logged out from the app. | `MainViewModel.kt` |
| `message_sent` | User sent a message in a conversation channel. | `conversation/Conversation.kt` |
| `channel_switched` | User switched to a different chat channel from the drawer. | `NavActivity.kt` |
| `profile_viewed` | User navigated to view another user's profile. | `NavActivity.kt` |
| `emoji_inserted` | User inserted an emoji into the message compose field. | `conversation/UserInput.kt` |
| `voice_message_started` | User began recording a voice message. | `conversation/UserInput.kt` |
| `voice_message_sent` | User completed and sent a voice message recording. | `conversation/UserInput.kt` |
| `voice_message_cancelled` | User cancelled an in-progress voice message recording. | `conversation/UserInput.kt` |
| `attachment_type_selected` | User tapped an attachment selector button (emoji, DM, photo, map, or phone). | `conversation/UserInput.kt` |
| `widget_added_to_home` | User requested to add the Jetchat widget to their home screen. | `components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807607)
- [Login → Message Sent Funnel](https://us.posthog.com/project/483112/insights/mW6Bnb51) — conversion rate from login to first message
- [Daily Active Senders](https://us.posthog.com/project/483112/insights/Nk9gdpS9) — unique users sending messages per day
- [Login vs Logout Trend](https://us.posthog.com/project/483112/insights/KrfR77Zz) — login and churn signal trend
- [Rich Message Feature Adoption](https://us.posthog.com/project/483112/insights/bq0JEI7e) — emoji, voice, and attachment usage
- [Voice Message Completion Rate](https://us.posthog.com/project/483112/insights/nejcPID8) — % of started voice messages that get sent

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to any `local.properties.example` or onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
