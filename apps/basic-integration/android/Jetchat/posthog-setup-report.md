<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Android/Kotlin project with PostHog. The app now initializes the PostHog Android SDK in an `Application` class using environment-backed `BuildConfig` values, enables lifecycle capture, screen views, session replay, and automatic error tracking, and wires in custom analytics for authentication, chat engagement, profile navigation, composer interactions, voice-recording actions, emoji usage, and widget pin requests.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Captures successful sign-in to connect an identified user session. | app/src/main/java/com/example/compose/jetchat/MainViewModel.kt |
| user_logged_out | Captures logout so authenticated session endings can be measured. | app/src/main/java/com/example/compose/jetchat/MainViewModel.kt |
| chat_opened | Captures navigation into a chat channel from the drawer. | app/src/main/java/com/example/compose/jetchat/NavActivity.kt |
| profile_opened | Captures navigation into a profile from chat or the drawer. | app/src/main/java/com/example/compose/jetchat/NavActivity.kt |
| message_sent | Captures successful message sends from the conversation composer. | app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt |
| message_recording_started | Captures when voice-message recording begins from the composer. | app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt |
| message_recording_finished | Captures when voice-message recording ends successfully. | app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt |
| message_recording_canceled | Captures when voice-message recording is canceled by gesture. | app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt |
| composer_tool_selected | Captures selection of composer actions like emoji, picture, map, DM, or phone. | app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt |
| emoji_inserted | Captures emoji insertion from the emoji picker into the draft. | app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt |
| profile_action_clicked | Captures taps on the primary profile action button. | app/src/main/java/com/example/compose/jetchat/profile/Profile.kt |
| widget_pin_requested | Captures attempts to add the chat widget from drawer settings. | app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831002)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/6hDf2qpz)
- [Messages sent over time (wizard)](https://us.posthog.com/project/483112/insights/5YSOPeUw)
- [Composer tool usage (wizard)](https://us.posthog.com/project/483112/insights/0QmYyM0r)
- [Profile openings over time (wizard)](https://us.posthog.com/project/483112/insights/a2iFNVQx)
- [Login to message funnel (wizard)](https://us.posthog.com/project/483112/insights/JopcslFu)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
