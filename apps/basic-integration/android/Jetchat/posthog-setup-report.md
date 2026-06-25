<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android app. The following changes were made:

- **`gradle/libs.versions.toml`** — Added PostHog SDK version (`3.31.0`) and library entry (`posthog-android`).
- **`app/build.gradle.kts`** — Enabled `buildConfig`, added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` `buildConfigField` entries read from `local.properties`, and added the `posthog-android` dependency.
- **`local.properties`** — Added `posthog.apiKey` and `posthog.host` (gitignored).
- **`JetchatApplication.kt`** (new file) — Application class that initializes PostHog with session replay, screen view tracking, lifecycle events, and error tracking enabled.
- **`AndroidManifest.xml`** — Registered `JetchatApplication` as the app's Application class and added a label to `NavActivity` for accurate screen view tracking.
- **`MainViewModel.kt`** — Added `PostHog.identify()` + `user_logged_in` event on login, and `user_logged_out` event + `PostHog.reset()` on logout.
- **`NavActivity.kt`** — Added `channel_switched` event capture when the user selects a channel from the navigation drawer.
- **`conversation/Conversation.kt`** — Added `message_sent` event capture (with `channel_name` and `message_length` properties) in the `UserInput.onMessageSent` handler.
- **`conversation/UserInput.kt`** — Added `emoji_selected` event capture when the user taps an emoji in the emoji selector.
- **`profile/ProfileFragment.kt`** — Added `profile_viewed` event capture in `onAttach` when a profile screen is opened.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with their username and password. | `MainViewModel.kt` |
| `user_logged_out` | User logs out from the app via the navigation drawer. | `MainViewModel.kt` |
| `message_sent` | User sends a message in a chat channel. | `conversation/Conversation.kt` |
| `channel_switched` | User switches to a different chat channel from the navigation drawer. | `NavActivity.kt` |
| `profile_viewed` | User opens a profile screen to view another user's information. | `profile/ProfileFragment.kt` |
| `emoji_selected` | User selects an emoji to insert into a chat message. | `conversation/UserInput.kt` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1761068)
  - Daily active users (login trend)
  - Messages sent per day
  - Login to first message funnel
  - Most used channels (message_sent by channel_name)
  - Profile engagement (profile_viewed over time)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `posthog.apiKey` and `posthog.host` to a `local.properties.example` (or your team's onboarding docs) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
