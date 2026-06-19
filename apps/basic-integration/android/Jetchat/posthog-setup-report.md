<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. A new `JetchatApplication` class was created to initialize the PostHog Android SDK at startup with lifecycle event tracking, screen view tracking, deep link tracking, and automatic error capture. The SDK is configured via `BuildConfig` fields sourced from `local.properties` (gitignored). Twelve custom events were instrumented across five source files covering the app's core user flows: authentication, chat messaging, voice recording, emoji/attachment selection, profile viewing, channel switching, and widget pinning.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password. | `MainViewModel.kt` |
| `user_logged_out` | User logs out from the app via the drawer menu. | `MainViewModel.kt` |
| `message_sent` | User sends a chat message in a conversation channel. | `Conversation.kt` |
| `voice_recording_started` | User starts recording a voice message by holding the mic button. | `UserInput.kt` |
| `voice_recording_finished` | User finishes and sends a voice recording. | `UserInput.kt` |
| `voice_recording_cancelled` | User cancels a voice recording by swiping away. | `UserInput.kt` |
| `emoji_selector_opened` | User opens the emoji selector panel in the message input area. | `UserInput.kt` |
| `attachment_panel_opened` | User opens an attachment panel (photo, map, or phone) from the input bar. | `UserInput.kt` |
| `profile_viewed` | User views a user profile screen. | `ProfileFragment.kt` |
| `channel_switched` | User switches to a different chat channel from the navigation drawer. | `JetchatDrawer.kt` |
| `message_link_clicked` | User taps a hyperlink inside a chat message bubble. | `Conversation.kt` |
| `widget_pin_requested` | User requests to pin the Jetchat widget to the home screen. | `JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/477964/dashboard/1736805)
  - User Login/Logout Funnel
  - Messages Sent Trend
  - Voice Recording Engagement Funnel
  - Channel Activity Breakdown
  - Feature Adoption (emoji, attachments, links)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file and any onboarding docs so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
