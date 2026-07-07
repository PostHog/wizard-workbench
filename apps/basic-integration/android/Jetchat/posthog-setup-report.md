<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Jetchat Android (Kotlin/Compose) app. A new `JetchatApplication` class was created to initialize the PostHog Android SDK on app startup with session replay, lifecycle event capture, screen view capture, and automatic error tracking enabled. The SDK is configured via `local.properties` (gitignored) with `BuildConfig` fields read at build time. The `AndroidManifest.xml` was updated to register the Application class, add the `INTERNET` permission, and add an `android:label` to `NavActivity` for accurate screen view tracking. PostHog capture and identify calls were added across five files covering all planned events.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | User logs out of the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | User sends a chat message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `message_author_profile_clicked` | User taps a message author's avatar to navigate to their profile. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel_switched` | User switches to a different chat channel from the drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | User navigates to view another user's profile. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `emoji_selector_opened` | User opens the emoji picker in the message input bar. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `photo_attachment_attempted` | User taps the photo attachment button in the message input bar. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `direct_message_attempted` | User taps the direct message button in the message input bar. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice_message_started` | User begins recording a voice message. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `widget_add_to_home_requested` | User requests to add the Jetchat widget to their home screen. | `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812153)
- [Daily logins & logouts (wizard)](https://us.posthog.com/project/483112/insights/ArJAtQOB)
- [Login to message sent funnel (wizard)](https://us.posthog.com/project/483112/insights/2VOy5acK)
- [Messages sent per day (wizard)](https://us.posthog.com/project/483112/insights/3U15czjt)
- [User engagement actions (wizard)](https://us.posthog.com/project/483112/insights/r9ADNulA)
- [Login to churn funnel (wizard)](https://us.posthog.com/project/483112/insights/FKzOCWRx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to `local.properties.example` (or document them in your onboarding README) so collaborators know what values to set in their own `local.properties`.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called in `MainViewModel.login()`. If your app ever restores a session without going through login (e.g. from persisted auth state), add an `identify` call there too so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
