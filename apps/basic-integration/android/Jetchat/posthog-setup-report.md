# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. A new `JetchatApplication` class was created to initialize the PostHog Android SDK (v3.31.0) on app startup, with configuration read from `local.properties` via `BuildConfig`. PostHog initialization includes automatic lifecycle event capture, screen view tracking, and error tracking. User identification is performed at login via `PostHog.identify()`, and the session is reset on logout via `PostHog.reset()`. Twelve custom events were added across six files to track the most valuable user actions in the app.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password. | `MainViewModel.kt` |
| `user_logged_out` | User logs out from the application via the drawer. | `MainViewModel.kt` |
| `message_sent` | User sends a text message in a channel. | `conversation/Conversation.kt` |
| `channel_switched` | User navigates to a different chat channel from the drawer. | `NavActivity.kt` |
| `profile_viewed` | User opens another user's profile screen. | `profile/ProfileFragment.kt` |
| `message_author_profile_clicked` | User clicks on a message author's avatar to view their profile. | `conversation/Conversation.kt` |
| `emoji_selector_opened` | User opens the emoji picker panel in the message input area. | `conversation/UserInput.kt` |
| `voice_recording_started` | User starts recording a voice message. | `conversation/UserInput.kt` |
| `voice_recording_completed` | User finishes recording a voice message and sends it. | `conversation/UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice message recording by swiping. | `conversation/UserInput.kt` |
| `message_drag_dropped` | User drops dragged text content into the chat conversation. | `conversation/Conversation.kt` |
| `widget_added_to_homescreen` | User requests to pin the Jetchat unread messages widget to their home screen. | `components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1812929)
- [Daily Logins & Logouts](https://us.posthog.com/project/483112/insights/E9TNWkaW)
- [Messages Sent Per Day](https://us.posthog.com/project/483112/insights/fR7xVD7P)
- [Login to First Message Funnel](https://us.posthog.com/project/483112/insights/02ZMOOSR)
- [Voice Recording Completion Rate](https://us.posthog.com/project/483112/insights/lWnuyAHc)
- [Feature Usage Trends](https://us.posthog.com/project/483112/insights/p5dqhmuF)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or your project's onboarding docs) so collaborators know what keys to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
