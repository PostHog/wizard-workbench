<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. A new `JetchatApplication` class was created to initialize PostHog on app start, including session replay, lifecycle event capture, screen view tracking, and automatic error tracking. The PostHog Android SDK (`com.posthog:posthog-android:3.31.0`) was added to the Gradle dependency catalog. User identification is called on login, and `PostHog.reset()` is called on logout. Twelve custom events were instrumented across five files covering the core user flows: authentication, messaging, channel navigation, attachment selection, and widget usage.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username and password. | `MainViewModel.kt` |
| `user_logged_out` | User explicitly logs out from the drawer menu. | `MainViewModel.kt` |
| `message_sent` | User sends a message in a conversation channel. | `Conversation.kt` |
| `message_drag_dropped` | User drops text content into the conversation via drag and drop. | `Conversation.kt` |
| `user_profile_tapped` | User taps on another user's avatar or name to view their profile. | `ConversationFragment.kt` |
| `channel_switched` | User selects a different channel from the navigation drawer. | `NavActivity.kt` |
| `profile_viewed` | User opens a profile page from the navigation drawer. | `NavActivity.kt` |
| `emoji_selector_opened` | User opens the emoji picker in the message input area. | `UserInput.kt` |
| `dm_selector_tapped` | User taps the direct message mention selector button in message input. | `UserInput.kt` |
| `photo_attachment_tapped` | User taps the photo attachment button in message input. | `UserInput.kt` |
| `map_selector_tapped` | User taps the map/location selector button in message input. | `UserInput.kt` |
| `widget_add_requested` | User taps the option to add the Jetchat widget to their home screen. | `JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1775054)
- **Login to Message Funnel:** [https://us.i.posthog.com/insights/3tvyGSZe](https://us.i.posthog.com/insights/3tvyGSZe)
- **Total Messages Sent Over Time:** [https://us.i.posthog.com/insights/aKMWKSnd](https://us.i.posthog.com/insights/aKMWKSnd)
- **Channel Engagement (Messages by Channel):** [https://us.i.posthog.com/insights/CSN5PDai](https://us.i.posthog.com/insights/CSN5PDai)
- **User Login vs Logout (Retention Signal):** [https://us.i.posthog.com/insights/aHNvUvnf](https://us.i.posthog.com/insights/aHNvUvnf)
- **Attachment & Feature Engagement:** [https://us.i.posthog.com/insights/0SGaeZXo](https://us.i.posthog.com/insights/0SGaeZXo)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or your onboarding docs) so collaborators know what values to set, since `local.properties` is gitignored.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is only called in `MainViewModel.login()`, which is correct for this app's flow, but verify if any session-restore logic should also re-identify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
