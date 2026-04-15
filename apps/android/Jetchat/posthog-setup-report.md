<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android (Jetpack Compose) application. PostHog is initialized in a new `JetchatApplication` class and configured via `local.properties` so no secrets are committed to source control. Nine custom events are instrumented across five files, covering the full user journey from login through active chat engagement to logout.

| Event | Description | File |
|---|---|---|
| `user logged in` | Fired on login form submit; also calls `PostHog.identify()` to link events to the user | `NavActivity.kt` |
| `user logged out` | Fired on logout; also calls `PostHog.reset()` to clear the user session | `NavActivity.kt` |
| `conversation opened` | Fired in `onResume` when the chat screen becomes active — top of engagement funnel | `ConversationFragment.kt` |
| `message sent` | Fired when a message is submitted; includes `channel` and `message_length` properties | `Conversation.kt` |
| `voice recording started` | Fired when the user presses and holds the record button | `UserInput.kt` |
| `voice recording completed` | Fired when the user releases the record button to finish recording | `UserInput.kt` |
| `voice recording cancelled` | Fired when the user swipes to cancel an in-progress recording | `UserInput.kt` |
| `profile viewed` | Fired in `onAttach` when a profile screen is loaded; includes `profile_user_id` | `ProfileFragment.kt` |
| `attachment panel opened` | Fired when any attachment selector (emoji, photo, map, phone, DM) is opened; includes `panel` type | `UserInput.kt` |

## Files created or modified

- **Created** `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes PostHog on startup
- **Modified** `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` and added `android:label` to the activity for screen view tracking
- **Modified** `app/build.gradle.kts` — Added `posthog-android:3.+` dependency, `buildConfig = true`, and `buildConfigField` entries reading from `local.properties`
- **Created** `local.properties` — Stores `posthog.apiKey` and `posthog.host` (gitignored)
- **Modified** `NavActivity.kt` — `user logged in` (with identify) and `user logged out` (with reset)
- **Modified** `ConversationFragment.kt` — `conversation opened`
- **Modified** `Conversation.kt` — `message sent`
- **Modified** `UserInput.kt` — Voice recording events and attachment panel events
- **Modified** `ProfileFragment.kt` — `profile viewed`

## Next steps

We've outlined a set of insights and a dashboard for you to track user behavior in PostHog, based on the events just instrumented. Visit the links below to build them in your PostHog project:

- **Analytics basics dashboard** — https://us.posthog.com/project/2/dashboard/new
- **Login-to-message conversion funnel** (user logged in → conversation opened → message sent) — https://us.posthog.com/project/2/insights/new?insight=FUNNELS
- **Daily active users trend** (unique users triggering `message sent`) — https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Voice recording adoption** (`voice recording started` over time) — https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Logout / churn rate** (`user logged out` trend) — https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Attachment panel usage breakdown** (`attachment panel opened` by panel type) — https://us.posthog.com/project/2/insights/new?insight=TRENDS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
