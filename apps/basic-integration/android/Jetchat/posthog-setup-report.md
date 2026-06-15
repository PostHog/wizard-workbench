<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. The PostHog Android SDK (`posthog-android`) was added as a Gradle dependency, initialized in a new `JetchatApplication` class, and event capture calls were added to the login/logout flow, conversation screen, message input, and navigation drawer. User identification is performed on login and reset on logout.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form (also calls `PostHog.identify`) | `MainViewModel.kt` |
| `user_logged_out` | User taps Logout in the drawer (also calls `PostHog.reset`) | `MainViewModel.kt` |
| `conversation_viewed` | User enters the conversation screen (top of engagement funnel) | `ConversationFragment.kt` |
| `message_sent` | User sends a chat message; includes `message_length` property | `UserInput.kt` |
| `emoji_selector_opened` | User opens the emoji selector panel | `UserInput.kt` |
| `voice_recording_started` | User begins recording a voice message | `UserInput.kt` |
| `chat_channel_selected` | User selects a chat channel from the drawer; includes `channel` property | `JetchatDrawer.kt` |
| `profile_viewed` | User navigates to a profile from the drawer; includes `profile_user_id` property | `JetchatDrawer.kt` |

### Files created

- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application class; initializes PostHog with lifecycle tracking, screen views, deep links, session replay, and error tracking autocapture.

### Files modified

- `gradle/libs.versions.toml` — Added `posthog = "3.+"` version and `posthog-android` library entry.
- `app/build.gradle.kts` — Enabled `buildConfig`, reads `posthog.apiKey` / `posthog.host` from `local.properties` into `BuildConfig` constants, added `posthog-android` dependency.
- `app/src/main/AndroidManifest.xml` — Registered `.JetchatApplication` as the app's `android:name`; added `android:label` to `NavActivity` for screen view tracking.
- `MainViewModel.kt` — Added `PostHog.identify`, `PostHog.capture("user_logged_in")`, `PostHog.capture("user_logged_out")`, and `PostHog.reset()`.
- `conversation/ConversationFragment.kt` — Added `PostHog.capture("conversation_viewed")` in `onResume()`.
- `conversation/UserInput.kt` — Added `PostHog.capture("message_sent")` on both send paths, `PostHog.capture("emoji_selector_opened")` on emoji selector open, and `PostHog.capture("voice_recording_started")` on record start.
- `components/JetchatDrawer.kt` — Added `PostHog.capture("chat_channel_selected")` and `PostHog.capture("profile_viewed")` in drawer item click handlers.
- `local.properties` — Written `posthog.apiKey` and `posthog.host` (gitignored).

## Next steps

The PostHog MCP API key did not have the required `dashboard:write`, `insight:write`, or `query:read` scopes, so the dashboard could not be created automatically. To create the recommended dashboard in PostHog:

1. Go to [Dashboards](https://us.posthog.com/project/2/dashboards) and create a new one named **"Analytics basics (wizard)"**.
2. Add these five insights:

   - **Login funnel** — Funnel: `user_logged_in` → `conversation_viewed` → `message_sent`
   - **Messages sent over time** — Trends: `message_sent` daily
   - **Active users** — Trends: `user_logged_in` unique users daily
   - **Churn rate** — Trends: `user_logged_out` over time
   - **Feature engagement** — Trends: `emoji_selector_opened` + `voice_recording_started` stacked

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` file (or your team's bootstrap docs) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `MainViewModel.login()` identifies on each login call, but consider also re-identifying if the user is already logged in when the app cold-starts.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
