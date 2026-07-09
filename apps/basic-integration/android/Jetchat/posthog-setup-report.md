<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Android Kotlin project with the PostHog Android SDK. The app now initializes PostHog from environment-backed `BuildConfig` values in a dedicated `Application` class, registers that application in the manifest, and enables lifecycle capture, deep link capture, screen view capture, session replay, and automatic error tracking. Custom analytics were added for login/logout, conversation-to-profile navigation, composer interactions, message sending, profile engagement, and widget rendering.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful login submissions to identify the user and record the selected login method. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Captures explicit logout actions before resetting the PostHog identity for the device. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Captures sent chat messages with composition context such as message length and emoji usage. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `profile_viewed` | Captures profile screen views to distinguish self-profile and teammate profile engagement. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `profile_action_clicked` | Captures taps on the profile action button to measure profile editing and outreach intent. | `app/src/main/java/com/example/compose/jetchat/profile/Profile.kt` |
| `conversation_member_opened` | Captures navigation from a conversation into a member profile for collaboration analysis. | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |
| `conversation_feature_clicked` | Captures taps on conversation header actions like search and info to measure feature discovery. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `composer_tool_selected` | Captures selection of message composer tools such as emoji, photo, map, and video actions. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `emoji_inserted` | Captures emoji insertions from the extended selector to understand richer message composition behavior. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `widget_rendered` | Captures unread-message widget renders to measure homescreen widget adoption. | `app/src/main/java/com/example/compose/jetchat/widget/JetChatWidget.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825320
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/yP0I62XU
- Insight: Messaging funnel (wizard) — https://us.posthog.com/project/483112/insights/F8jTEoSz
- Insight: Composer tools used (wizard) — https://us.posthog.com/project/483112/insights/q5O6ysgD
- Insight: Profile engagement (wizard) — https://us.posthog.com/project/483112/insights/E0rgvzdI
- Insight: Widget renders (wizard) — https://us.posthog.com/project/483112/insights/gKBacpXg

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
