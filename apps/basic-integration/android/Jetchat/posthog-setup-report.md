<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog Android SDK initialization was added in a new application class, wired through the manifest, configured from environment variables exposed as BuildConfig fields, and instrumented for key product flows including login, logout, message sending, emoji selection, profile views, and widget pin requests. Error capture was also added around widget pinning, while default PostHog mobile capabilities such as screen views, session replay, and automatic exception capture remain enabled.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures when a user signs into the chat experience from the login screen. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Captures when a signed-in user logs out from the app drawer. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Captures when a user sends a chat message from the conversation composer. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `emoji_selected` | Captures when a user inserts an emoji from the expanded emoji picker. | `app/src/main/java/com/example/compose/jetchat/conversation/UserInput.kt` |
| `profile_viewed` | Captures when a user opens a profile from chat or the drawer. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `widget_pin_requested` | Captures when a user requests adding the unread messages widget to the home screen. | `app/src/main/java/com/example/compose/jetchat/components/JetchatDrawer.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1824902
- Insight: Logins by day (wizard) — https://us.posthog.com/project/483112/insights/9tayCHjk
- Insight: Message activity by day (wizard) — https://us.posthog.com/project/483112/insights/gLjGHvrJ
- Insight: Login to message funnel (wizard) — https://us.posthog.com/project/483112/insights/zwT1aJie
- Insight: Profile views by day (wizard) — https://us.posthog.com/project/483112/insights/c69vSvPR
- Insight: Widget pin requests by day (wizard) — https://us.posthog.com/project/483112/insights/aPnM6AZh

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
