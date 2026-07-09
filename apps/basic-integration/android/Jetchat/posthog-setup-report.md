<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. PostHog is initialized in a new `JetchatApplication` class and configured via `local.properties` so secrets never appear in source code. User identity is established on login with `PostHog.identify()` and reset on logout with `PostHog.reset()`. Seven custom events are captured across four files covering the core user flows: authentication, messaging, navigation, and in-message interactions.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs into the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out of the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when the user sends a message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel_opened` | Fired when a user navigates to a chat channel from the drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a user opens another user's profile. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `emoji_inserted` | Fired when a user selects an emoji from the emoji picker. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice_recording_started` | Fired when the user begins recording a voice message. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824440)
- **Daily logins**: [https://us.posthog.com/project/483112/insights/mxbO578c](https://us.posthog.com/project/483112/insights/mxbO578c)
- **Messages sent per day**: [https://us.posthog.com/project/483112/insights/UEad7e8N](https://us.posthog.com/project/483112/insights/UEad7e8N)
- **Login to message funnel**: [https://us.posthog.com/project/483112/insights/Pz7ThCPv](https://us.posthog.com/project/483112/insights/Pz7ThCPv)
- **Channel popularity**: [https://us.posthog.com/project/483112/insights/BQVo8Zgb](https://us.posthog.com/project/483112/insights/BQVo8Zgb)
- **User churn — logout rate**: [https://us.posthog.com/project/483112/insights/SaSD1iAC](https://us.posthog.com/project/483112/insights/SaSD1iAC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to your `local.properties.example` (or equivalent template) and any team onboarding scripts so collaborators know what keys to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `MainViewModel.login()` currently identifies on fresh login, but if users are restored from a persisted session (e.g., across app restarts), add an `identify` call there too so returning sessions are not on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
