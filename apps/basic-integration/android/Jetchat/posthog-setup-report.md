<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. The PostHog Android SDK (`posthog-android`) was added as a dependency, configured via `local.properties` (gitignored), and initialized in a new `JetchatApplication` class. Event tracking was added to the login/logout flow (with user identification), message sending in conversations, channel switching, and profile viewing.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with a username. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out from the app. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a message in a conversation channel. | `app/src/main/java/com/example/compose/jetchat/conversation/ConversationFragment.kt` |
| `channel_switched` | Fired when a user navigates to a different chat channel from the drawer. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a user opens another user's profile. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |

## Next steps

A dashboard could not be created automatically because the PostHog API key used by the wizard lacked the required `dashboard:write` and `query:read` scopes. To create insights manually, visit your [PostHog project](https://us.posthog.com/project/2) and build insights for the events above. Recommended insights:

- **Logins over time** — Trends for `user_logged_in`
- **Messages sent over time** — Trends for `message_sent` broken down by `channel`
- **Login → Message sent funnel** — Funnel: `user_logged_in` → `message_sent`
- **Channel popularity** — Trends for `channel_switched` broken down by `channel`
- **User retention** — Retention based on `user_logged_in` returning to `message_sent`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to `local.properties.example` (or any onboarding docs) so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
