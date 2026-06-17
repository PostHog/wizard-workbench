<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. The PostHog Android SDK (`posthog-android`) was added as a dependency, an Application class was created to initialize PostHog early in the app lifecycle, and five business-critical events were instrumented across the login flow, messaging, and navigation.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in, with `username` property. Calls `PostHog.identify()` to link the user. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `user_logged_out` | Fired when a user logs out. Calls `PostHog.reset()` to clear the identified user. | `app/src/main/java/com/example/compose/jetchat/MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message, with `channel_name` and `message_length` properties. | `app/src/main/java/com/example/compose/jetchat/conversation/Conversation.kt` |
| `chat_channel_opened` | Fired when a user opens a chat channel from the navigation drawer, with `channel_name` property. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |
| `profile_viewed` | Fired when a user views another user's profile, with `profile_user_id` property. | `app/src/main/java/com/example/compose/jetchat/NavActivity.kt` |

## Next steps

We attempted to build a PostHog dashboard automatically, but the current API key is missing the required scopes (`query:read`, `insight:write`, `dashboard:write`). You can create the "Analytics basics (wizard)" dashboard manually by visiting:

- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

Suggested insights for the dashboard:
1. **User logins over time** — Trends chart for `user_logged_in` events
2. **Messages sent over time** — Trends chart for `message_sent` events broken down by `channel_name`
3. **Login → Message sent funnel** — Funnel from `user_logged_in` → `message_sent` to measure onboarding conversion
4. **Profile views over time** — Trends chart for `profile_viewed` events
5. **User retention** — Retention chart: users who performed `user_logged_in` and returned to `message_sent`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file so collaborators know what to set (these values come from `local.properties` which is gitignored).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
