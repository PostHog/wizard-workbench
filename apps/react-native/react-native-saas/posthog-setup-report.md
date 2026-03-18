<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** — New PostHog client configuration using `react-native-config` to load credentials from environment variables. Analytics are gracefully disabled if no project token is configured.
- **`src/routes.js`** — Added `PostHogProvider` (with autocapture for touches) inside `NavigationContainer`, plus manual screen tracking via `posthog.screen()` on navigation state changes (required for React Navigation v7 compatibility).
- **`src/store/modules/auth/sagas.js`** — Added `posthog.identify()` on sign-in to associate users with their email, and captures `user_signed_in`, `sign_in_failed`, and `user_signed_out` events.
- **`src/store/modules/projects/sagas.js`** — Captures `project_created` with project title/ID, and exception tracking on errors.
- **`src/store/modules/teams/sagas.js`** — Captures `team_created` with team name/ID, `team_selected` when a user switches teams, and exception tracking on errors.
- **`src/store/modules/members/sagas.js`** — Captures `member_invited` with email, `member_role_updated` with member ID and role count, and exception tracking on errors.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User sign-in attempt failed | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `project_created` | User created a new project | `src/store/modules/projects/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `member_invited` | User invited a new member to the team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

To build your analytics dashboard in PostHog, navigate to [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and create a new dashboard named **"Analytics basics"**. We recommend the following five insights:

1. **Sign-in funnel** — Funnel from `user_signed_in` → `team_selected` → `project_created` to measure onboarding conversion.
2. **Daily active users** — Unique users who triggered `user_signed_in` over time (trend graph).
3. **Sign-in failure rate** — `sign_in_failed` event count over time to monitor auth issues.
4. **Team & project creation** — Stacked trend of `team_created` and `project_created` to track growth activity.
5. **Member collaboration** — Trend of `member_invited` and `member_role_updated` to measure collaboration adoption.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
