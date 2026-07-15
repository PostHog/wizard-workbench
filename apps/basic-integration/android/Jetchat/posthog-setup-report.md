<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the Jetchat Android app. Changes include installing the PostHog Android SDK, creating an Application class that initialises PostHog at startup with session replay and error tracking enabled, wiring up user identification on login, resetting the PostHog session on logout, and adding nine custom capture events across five Kotlin source files.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when the user submits the login form and is authenticated. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when the user taps the Logout action in the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when the user sends a chat message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel_switched` | Fired when the user selects a different channel from the navigation drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when the user navigates to another user's profile screen. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `emoji_panel_opened` | Fired when the user opens the emoji selector panel in the message input. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `attachment_panel_opened` | Fired when the user taps a media/location/phone attachment button in the message input. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `message_author_clicked` | Fired when the user taps on an author avatar or name to view their profile. | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |
| `drag_drop_message_received` | Fired when the user drops text content into the conversation via drag-and-drop. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1853390)
- [Login to message funnel (wizard)](https://us.i.posthog.com/project/483112/insights/73GCZK2j)
- [Messages sent per day (wizard)](https://us.i.posthog.com/project/483112/insights/hlCn2FKH)
- [Messages sent by channel (wizard)](https://us.i.posthog.com/project/483112/insights/9IYqQWK2)
- [User logins per day (wizard)](https://us.i.posthog.com/project/483112/insights/4lWZgw39)
- [Attachment panels opened by type (wizard)](https://us.i.posthog.com/project/483112/insights/hHjhELNs)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to `local.properties.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
