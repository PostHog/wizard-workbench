<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. PostHog is initialized in a new `JetchatApplication` class that is registered as the Android Application class. The SDK is configured with session replay, automatic screen view capture, lifecycle event tracking, and automatic error capture. Credentials are loaded from `local.properties` via `BuildConfig` fields — no keys are hardcoded. Events are captured at the key user-action sites across the app: login, logout, message sending, channel navigation, and profile viewing.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the app. Also calls `PostHog.identify()`. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out of the app. Also calls `PostHog.reset()`. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `channel_switched` | Fired when a user navigates to a different chat channel from the drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a user opens another user's profile screen. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1760773)
- [User logins over time](https://us.i.posthog.com/project/483112/insights/LSLNZHK0)
- [Login to message sent funnel](https://us.i.posthog.com/project/483112/insights/IGcc4peh)
- [Messages sent over time](https://us.i.posthog.com/project/483112/insights/7rkrvosT)
- [Popular channels](https://us.i.posthog.com/project/483112/insights/q1MVeCeT)
- [Profile views over time](https://us.i.posthog.com/project/483112/insights/LjvmV8t3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` (or equivalent onboarding docs) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
