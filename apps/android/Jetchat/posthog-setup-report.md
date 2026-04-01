<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Jetchat Android application. Here is a summary of all changes made:

**New files created:**
- `app/src/main/java/com/example/compose/jetchat/JetchatApplication.kt` — Application subclass that initializes the PostHog Android SDK using keys read from `BuildConfig`.
- `local.properties` (updated) — PostHog API key and host stored here; gitignored by default.

**Existing files modified:**
- `app/build.gradle.kts` — Added `posthog-android:3.+` dependency, enabled `buildConfig`, added `buildConfigField` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST` read from `local.properties`.
- `app/src/main/AndroidManifest.xml` — Registered `JetchatApplication` as the `android:name` of the `<application>` element so PostHog is initialized on app start.
- `MainViewModel.kt` — `PostHog.identify()` and `user logged in` event on login; `PostHog.reset()` and `user logged out` event on logout.
- `conversation/Conversation.kt` — `message sent` event (with `channel` property) when a message is submitted.
- `NavActivity.kt` — `channel switched` event (with `channel` property) and `profile viewed` event (with `profile_user_id` property) from drawer callbacks.
- `conversation/UserInput.kt` — `emoji selector opened` when the emoji picker is first shown; `voice recording started` and `voice recording completed` in the record button callbacks.
- `components/JetchatDrawer.kt` — `widget added to home screen` event after `requestPinAppWidget` succeeds.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user logged in` | Fired when a user logs in; also calls `PostHog.identify()` | `MainViewModel.kt` |
| `user logged out` | Fired when a user logs out; also calls `PostHog.reset()` | `MainViewModel.kt` |
| `message sent` | Fired when the user sends a chat message (includes `channel` property) | `conversation/Conversation.kt` |
| `channel switched` | Fired when the user switches to a different chat channel from the drawer (includes `channel` property) | `NavActivity.kt` |
| `profile viewed` | Fired when the user navigates to a profile screen (includes `profile_user_id`) | `NavActivity.kt` |
| `emoji selector opened` | Fired when the emoji picker panel is first opened | `conversation/UserInput.kt` |
| `voice recording started` | Fired when the user starts recording a voice message | `conversation/UserInput.kt` |
| `voice recording completed` | Fired when the user finishes a voice recording | `conversation/UserInput.kt` |
| `widget added to home screen` | Fired when the user successfully pins the Jetchat widget | `components/JetchatDrawer.kt` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login trend** — Trend of `user logged in` over time. Gives daily/weekly active user signal.
2. **Login → message sent funnel** — Funnel: `user logged in` → `message sent`. Measures how many users who log in go on to send at least one message (core engagement funnel).
3. **Messages sent per channel** — Breakdown of `message sent` by `channel` property. Shows which channels are most active.
4. **Voice recording completion rate** — Funnel: `voice recording started` → `voice recording completed`. Identifies drop-off from the voice feature.
5. **Retention: returning users** — Retention chart based on `user logged in` as the starting event and `message sent` as the return event.

Create your dashboard here: https://us.posthog.com/project/238460/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-android/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
