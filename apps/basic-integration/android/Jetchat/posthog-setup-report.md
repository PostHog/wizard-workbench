<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. A new `JetchatApplication` class was created to initialize the PostHog Android SDK on startup, the `AndroidManifest.xml` was updated to register it, and the PostHog token and host are loaded securely from `local.properties` via Gradle `BuildConfig` fields. Events were instrumented across the key user flows: authentication, messaging, navigation, and input behaviors.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `MainViewModel.kt` |
| `user_logged_out` | Fired when a user taps Logout in the navigation drawer | `MainViewModel.kt` |
| `message_sent` | Fired when a user sends a chat message | `conversation/Conversation.kt` |
| `profile_viewed` | Fired when a user taps another user's avatar to view their profile | `conversation/Conversation.kt` |
| `chat_channel_switched` | Fired when a user selects a different chat channel from the drawer | `components/JetchatDrawer.kt` |
| `emoji_selector_opened` | Fired when a user opens the emoji picker panel | `conversation/UserInput.kt` |
| `voice_message_started` | Fired when a user begins recording a voice message | `conversation/UserInput.kt` |
| `voice_message_cancelled` | Fired when a user cancels an in-progress voice recording | `conversation/UserInput.kt` |
| `drawer_opened` | Fired when a user opens the navigation drawer | `conversation/ConversationFragment.kt` |
| `widget_added_to_home_screen` | Fired when a user pins the Jetchat widget to their home screen | `components/JetchatDrawer.kt` |

## Next steps

The PostHog MCP API key does not currently have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. Once the API key is updated with those scopes, create a dashboard named **"Analytics basics (wizard)"** with the following five insights:

1. **Daily Active Users** — Trends: `user_logged_in`, unique users, last 30 days.
2. **Messages Sent Over Time** — Trends: `message_sent`, event count, broken down by `channel` property.
3. **Login → Message Sent Funnel** — Funnel: Step 1 `user_logged_in` → Step 2 `message_sent`. Measures conversion from session start to first message.
4. **Engagement Features Usage** — Trends: `emoji_selector_opened` + `voice_message_started` side-by-side, last 14 days.
5. **Churn: Logout Rate** — Trends: `user_logged_out`, unique users, last 30 days.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or equivalent) so collaborators know what values to set locally.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, so returning sessions that do not log in again will remain on anonymous distinct IDs until `login()` is called.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
