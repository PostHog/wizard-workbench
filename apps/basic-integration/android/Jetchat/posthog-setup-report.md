<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. PostHog is initialized in a new `JetchatApp` Application class using credentials read from `local.properties` via Gradle `BuildConfig` fields. Ten custom events are captured across five files, covering the full user journey from login through messaging, navigation, and feature discovery. User identification is performed at login via `PostHog.identify()` and the session is reset on logout via `PostHog.reset()`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username. | `MainViewModel.kt` |
| `user_logged_out` | User logs out of the app from the navigation drawer. | `MainViewModel.kt` |
| `message_sent` | User sends a message in a chat channel. | `Conversation.kt` |
| `channel_switched` | User switches to a different chat channel from the drawer. | `NavActivity.kt` |
| `profile_viewed` | User navigates to view a user profile. | `NavActivity.kt` |
| `emoji_selector_opened` | User opens the emoji picker panel in the message input area. | `UserInput.kt` |
| `recording_started` | User starts recording a voice message. | `UserInput.kt` |
| `recording_cancelled` | User cancels a voice message recording by swiping. | `UserInput.kt` |
| `attachment_picker_opened` | User taps a media attachment button (photo, map, or video call) in the input bar. | `UserInput.kt` |
| `widget_add_requested` | User taps the option to add the Jetchat widget to the home screen. | `JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** https://us.posthog.com/project/483112/dashboard/1792371
- **Daily Active Users (Login trend):** https://us.posthog.com/project/483112/insights/R0CUIyZc
- **Messages Sent per Day:** https://us.posthog.com/project/483112/insights/p4zhh3fG
- **Login to Message Funnel:** https://us.posthog.com/project/483112/insights/jwJVY7hk
- **Channel Engagement:** https://us.posthog.com/project/483112/insights/RtTumTGu
- **Attachment Types Used:** https://us.posthog.com/project/483112/insights/9MOpfhtW

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to `local.properties.example` (or equivalent onboarding docs) so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
