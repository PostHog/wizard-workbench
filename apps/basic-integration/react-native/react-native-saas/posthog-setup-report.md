<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): Initializes the PostHog client using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` at build time. Analytics are gracefully disabled when the token is absent.
- **`src/routes.js`**: Wraps the stack navigator with `PostHogProvider` (placed inside `NavigationContainer` per React Navigation v7 requirements). Adds manual screen tracking via `onReady`/`onStateChange` callbacks since React Navigation v7 requires this approach. Touch autocapture is enabled.
- **`src/store/modules/auth/sagas.js`**: Identifies users with `posthog.identify()` on sign-in, and captures `signed_in`, `signed_out`, and `sign_in_failed` events. Calls `posthog.reset()` on sign-out to clear the distinct ID.
- **`src/store/modules/teams/sagas.js`**: Captures `team_created` and `team_selected` events with relevant IDs.
- **`src/store/modules/projects/sagas.js`**: Captures `project_created` with project and team IDs.
- **`src/store/modules/members/sagas.js`**: Captures `member_invited` and `member_role_updated` events.
- **`.env`** (created): Contains `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `signed_out` | User signed out and session cleared | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign-in attempt failed with invalid credentials | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sent an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updated a team member's roles | `src/store/modules/members/sagas.js` |

## Next steps

The PostHog API key used during setup did not have `dashboard:write` or `query:read` scopes, so the dashboard could not be created automatically. To build your "Analytics basics" dashboard, visit PostHog and create a new dashboard with these recommended insights:

1. **Sign-ins over time** — Trends chart for `signed_in` broken down by `is_demo`
2. **Sign-in failures** — Trends chart for `sign_in_failed` to monitor authentication issues
3. **Onboarding funnel** — Funnel: `signed_in` → `team_selected` → `project_created` to track activation
4. **Team & project growth** — Trends chart with `team_created` and `project_created` as two series
5. **Member invitations** — Trends chart for `member_invited` to track viral growth

You can create these at [/insights](/insights) and pin them to a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
