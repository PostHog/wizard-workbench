<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Jetchat Android app. A new `JetchatApplication` class was created to initialize PostHog using credentials from `local.properties`, with session replay and error tracking enabled. Eight events are now captured across six files, covering the full user lifecycle from login through messaging, profile browsing, and widget usage.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with a username. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out of the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile_viewed` | Fired when a user opens another user's profile screen. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `channel_switched` | Fired when a user switches to a different chat channel from the drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `emoji_picker_opened` | Fired when a user opens the emoji selector in the message input area. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `voice_recording_started` | Fired when a user starts recording a voice message. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `widget_added_to_home_screen` | Fired when a user requests to add the Jetchat widget to their home screen. | `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818053)
- [Daily logins and logouts](https://us.posthog.com/project/483112/insights/09fAA4QP)
- [Messages sent over time](https://us.posthog.com/project/483112/insights/GraaCETh)
- [Login to message funnel](https://us.posthog.com/project/483112/insights/KfPNTWwm)
- [Channel switching breakdown](https://us.posthog.com/project/483112/insights/s9qgWm7M)
- [Profile views trend](https://us.posthog.com/project/483112/insights/nCBGyuGe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or your team's bootstrap script) so collaborators know what keys to set — `local.properties` is gitignored.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called in `MainViewModel.login()`. If users can resume a session without re-logging in (e.g. persisted auth state), add an `identify` call on app startup when a stored session is found.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
