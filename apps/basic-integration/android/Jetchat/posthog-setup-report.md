<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog Android was added to the app module, initialized in a new `Application` class using `BuildConfig` values sourced from `.env`, registered in the manifest, and wired for lifecycle events, screen views, session replay, and automatic exception capture. Custom analytics were added for demo login, drawer usage, conversation viewing, message sending, profile viewing, and logout, while identifying users on login and resetting identity on logout.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Captured when a user submits the demo login form and a session becomes identified. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `drawer_opened` | Captured when an authenticated user opens the app drawer navigation. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `conversation_viewed` | Captured when the main conversation experience is shown to the user. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `message_sent` | Captured when a user sends a message from the conversation composer. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `profile_viewed` | Captured when a profile screen is opened for the current or another user. | `app/src/main/java/com/example/compose/jetchat/profile/Profile.kt` |
| `logout_clicked` | Captured when a signed-in user logs out from the drawer menu. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1806881
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/km1SgOgY
- Insight: Messages sent over time (wizard) — https://us.posthog.com/project/483112/insights/IrAVD9X1
- Insight: Profile views by type (wizard) — https://us.posthog.com/project/483112/insights/IenF4ztm
- Insight: Message send method split (wizard) — https://us.posthog.com/project/483112/insights/YmywiTf4
- Insight: Login to message conversion (wizard) — https://us.posthog.com/project/483112/insights/2beskmK7

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
