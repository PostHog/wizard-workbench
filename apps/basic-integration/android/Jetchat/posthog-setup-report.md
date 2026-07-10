<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. A new `JetchatApplication` class was created and registered in `AndroidManifest.xml` to initialize PostHog as early as possible with session replay, lifecycle event capture, deep-link tracking, and automatic error tracking enabled. The PostHog Android SDK was added as a dependency via the Gradle version catalog (`libs.versions.toml`), and `BuildConfig` fields read from `local.properties` carry the API key and host — no secrets are hardcoded. Five events covering the core user journey (login, logout, channel opens, message sending, and profile views) are now tracked, with `identify()` called on login and `reset()` on logout to maintain clean user attribution.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out of the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message in a channel. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `profile_viewed` | Fired when a user views another user's profile. | `app/src/main/java/com/example/compose/jetchat/profile/ProfileFragment.kt` |
| `chat_channel_opened` | Fired when the user opens a chat channel conversation. | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829140)
- [Daily logins](https://us.posthog.com/project/483112/insights/8D8KuPMH) — Line chart of `user_logged_in` events per day over 30 days
- [Messages sent per day](https://us.posthog.com/project/483112/insights/CKprvgko) — Bar chart of `message_sent` events per day over 30 days
- [Login to message funnel](https://us.posthog.com/project/483112/insights/Q3Q7dCNn) — Conversion funnel: login → channel open → message sent (key engagement path)
- [User retention after login](https://us.posthog.com/project/483112/insights/Iips5iFg) — Weekly retention cohort: how often users return to send messages after first login
- [Profile views & logouts trend](https://us.posthog.com/project/483112/insights/MaYegYt2) — Combined trend of `profile_viewed` and `user_logged_out` to watch churn signals

Dashboard subscription and alerts were skipped — the wizard was unable to prompt for your consent in this session. You can set them up directly in PostHog: open the dashboard and use the "Subscribe" and "Alerts" options from the actions menu.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to any `.env.example` or bootstrap-script documentation so collaborators know what to set in `local.properties`.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called in `MainViewModel.login()`, so users who are already authenticated when the app launches will be on an anonymous distinct ID until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
