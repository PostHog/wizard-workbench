# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **`src/config/posthog.js`** (new file): Singleton PostHog client instance using `react-native-config` to load `POSTHOG_KEY` and `POSTHOG_HOST` from the `.env` file at build time. The client is disabled gracefully if no API key is configured, and enables debug logging in development, app lifecycle event capture, and feature flag preloading.
- **`src/routes.js`**: Added `PostHogProvider` (wrapping the navigator stack) and manual screen tracking via `posthog.screen()` inside `NavigationContainer`'s `onStateChange` callback. Manual tracking is required because React Navigation v7 breaks PostHog's automatic screen capture.
- **`src/store/modules/auth/sagas.js`**: Added `posthog.identify()` on successful sign-in (both demo and real API paths), `posthog.capture('user_signed_in')`, `posthog.capture('sign_in_failed')`, `posthog.capture('user_signed_out')`, and `posthog.reset()` on sign-out.
- **`src/store/modules/teams/sagas.js`**: Added `team_created`, `team_create_failed`, and `team_selected` events.
- **`src/store/modules/projects/sagas.js`**: Added `project_created` and `project_create_failed` events (with team context).
- **`src/store/modules/members/sagas.js`**: Added `member_invited`, `member_invite_failed`, `member_role_updated`, and `member_role_update_failed` events.
- **`.env`** (new file): Contains `POSTHOG_KEY` and `POSTHOG_HOST` environment variables, added to `.gitignore` automatically.

All events include an `is_demo` boolean property to distinguish demo-mode activity from real user data. Error events include `$exception_type` and `$exception_message` for use with PostHog's error tracking.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in (demo and real). Used for funnel analysis and user identification. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out. Resets PostHog identity; used to measure churn signals. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Fired when a sign-in attempt fails. Used to monitor authentication friction. | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a user successfully creates a new team. Key conversion event in the onboarding funnel. | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | Fired when team creation fails. Used to track backend errors. | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fired when a user switches to a different team. Used to track team engagement. | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a user successfully creates a new project. Core conversion event. | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | Fired when project creation fails. Used to track backend errors. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a user successfully sends a team member invitation. Viral loop and growth metric. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Fired when a member invite fails. Used to track invite friction. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a member's role is updated. Used to track team management activity. | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Fired when a member role update fails. | `src/store/modules/members/sagas.js` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the configured PostHog personal API key does not have the `dashboard:write` scope. You can create the dashboard manually in PostHog with the following recommended insights:

1. **Sign-in conversion funnel** — Funnel: `user_signed_in` → `team_created` → `project_created`. Shows how many users complete the core onboarding flow.
2. **Daily active users** — Trends: unique users firing `user_signed_in` over time. Core engagement metric.
3. **Team & project creation over time** — Trends: `team_created` and `project_created` event counts. Tracks growth in team and project adoption.
4. **Member invitation rate** — Trends: `member_invited` event count. Tracks viral loop and collaboration activity.
5. **Authentication failure rate** — Trends: `sign_in_failed` count vs `user_signed_in` count. Monitors login friction.

To build these, go to [PostHog Insights](https://us.posthog.com/project/2/insights) and create each insight using the event names above, then pin them to a new "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
