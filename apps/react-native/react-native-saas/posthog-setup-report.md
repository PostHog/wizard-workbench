<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. Here's a summary of all changes made:

**New files created:**
- `src/config/posthog.js` — Initializes the PostHog client using `react-native-config` environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). The client is disabled automatically if the API key is missing, and debug logging is enabled in `__DEV__` mode.
- `.env` — Contains `POSTHOG_API_KEY` and `POSTHOG_HOST` values (already covered by `.gitignore`).

**Modified files:**
- `src/routes.js` — Wraps the navigation stack in `<PostHogProvider>` with autocapture enabled for touch events. Manual screen tracking via `posthog.screen()` is wired into `onStateChange` on the `NavigationContainer` (required for React Navigation v7, which disables automatic screen capture).
- `src/store/modules/auth/sagas.js` — Calls `posthog.identify()` on successful sign-in to associate events with the user. Captures `user_signed_in`, `user_signed_out`, and `sign_in_failed` events. Calls `posthog.reset()` on sign-out to clear the user identity.
- `src/store/modules/teams/sagas.js` — Captures `team_created` (with team name/id) and `team_selected` (with team name/id) events.
- `src/store/modules/projects/sagas.js` — Captures `project_created` (with project title, id, and the parent team name/id).
- `src/store/modules/members/sagas.js` — Captures `member_invited` (with invited email and team context) and `member_role_updated` (with member id, role names, and team context).

**Packages installed:**
- `posthog-react-native` — PostHog SDK for React Native
- `react-native-device-info` — Required peer dependency
- `react-native-localize` — Required peer dependency
- `react-native-config` — Loads environment variables from `.env` at build time

> **iOS note:** Run `cd ios && pod install` after installing to link the native modules.

## Instrumented Events

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invites a new member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updates a member's roles | `src/store/modules/members/sagas.js` |

## Next steps

We've connected this data to the existing **Analytics basics** dashboard, which tracks core business metrics. You can view it here:

- [Analytics basics Dashboard](https://us.posthog.com/project/2/dashboard/1344803)

The dashboard includes these insights built around your instrumented events:

- [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — Daily sign-ins over the last 30 days
- [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — Pricing → Checkout conversion funnel
- [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — Checkout completions and subscription changes
- [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI) — Member invitations and removals over time
- [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — Account deletion events over time

### iOS Native Module Setup

Because this is a bare React Native project (not Expo), you must run pod install after the package installation:

```bash
cd ios && pod install
```

### Configuring the environment

The `.env` file at the project root contains the PostHog credentials. Make sure to rebuild the native app after any `.env` changes, as `react-native-config` embeds values at build time.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
