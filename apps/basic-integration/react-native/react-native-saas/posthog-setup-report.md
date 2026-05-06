<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. Here's a summary of all changes made:

- **`src/config/posthog.js`** *(new)* — PostHog client instance initialized with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `react-native-config`. The client is disabled gracefully when env vars are not configured.
- **`src/routes.js`** — Added `PostHogProvider` (client-based) inside `NavigationContainer` for React Navigation v7 compatibility. Manual screen tracking via `onStateChange` + `onReady`. Touch autocapture enabled; automatic screen capture disabled (handled manually).
- **`src/store/modules/auth/sagas.js`** — `posthog.identify()` called on sign-in to associate the user's email as their distinct ID. `posthog.capture('user_signed_in')` on success (with `method: demo|password`), `posthog.capture('user_sign_in_failed')` on error, and `posthog.capture('user_signed_out')` + `posthog.reset()` on sign-out.
- **`src/store/modules/teams/sagas.js`** — `posthog.capture('team_created')` after team creation, `posthog.capture('team_switched')` when a user switches active team.
- **`src/store/modules/projects/sagas.js`** — `posthog.capture('project_created')` after successful project creation.
- **`src/store/modules/members/sagas.js`** — `posthog.capture('member_invited')` after sending invites, `posthog.capture('member_role_updated')` after updating member roles.
- **`.env`** *(new)* — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables set. Covered by `.gitignore`.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email and password | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Sign-in attempt failed (invalid credentials) | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to a team by email | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated the role of an existing team member | `src/store/modules/members/sagas.js` |

## Next steps

We've suggested some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. You can build these directly in PostHog:

- **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)** — Create a new dashboard and add the following insights:
  - **Sign-in funnel** — Funnel from `user_signed_in` → `team_switched` → `project_created` to measure onboarding conversion
  - **Daily active sign-ins** — Trend of `user_signed_in` over time to track daily active users
  - **Churn signal** — Trend of `user_signed_out` to monitor logout/churn patterns
  - **Team & project growth** — Trend of `team_created` and `project_created` to track product adoption
  - **Member collaboration** — Trend of `member_invited` to measure collaboration and virality

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
