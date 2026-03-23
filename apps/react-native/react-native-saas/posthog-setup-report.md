<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the React Native SaaS application. The following changes were made:

- **`src/config/posthog.js`** (new file): PostHog client configured using `react-native-config` to load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`. Gracefully disabled when no token is set.
- **`src/routes.js`**: Added `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility) with autocapture enabled for touch events. Manual screen tracking added via `onReady`/`onStateChange` callbacks using `posthog.screen()`.
- **`src/store/modules/auth/sagas.js`**: Added `user_signed_in` (with `posthog.identify()`), `user_signed_out` (with `posthog.reset()`), and `sign_in_failed` events.
- **`src/store/modules/teams/sagas.js`**: Added `team_created`, `team_create_failed`, and `team_selected` events.
- **`src/store/modules/projects/sagas.js`**: Added `project_created` and `project_create_failed` events.
- **`src/store/modules/members/sagas.js`**: Added `member_invited`, `member_invite_failed`, `member_role_updated`, and `member_role_update_failed` events.
- **`.env`**: Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **Packages installed**: `posthog-react-native`, `react-native-config`, `react-native-svg`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User login attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | Team creation failed | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | Project creation failed | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invites a new member to the team | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Member invite failed | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updates a member's role in the team | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Member role update failed | `src/store/modules/members/sagas.js` |

## Next steps

Visit your PostHog project to create an "Analytics basics" dashboard with these recommended insights:

- [PostHog Project Dashboards](https://us.posthog.com/project/238460/dashboard)

**Recommended insights to build:**

1. **Sign-in trend** — Trend of `user_signed_in` over time (daily). Gauge overall user activity.
2. **Sign-in funnel** — Funnel: `user_signed_in` → `team_selected` → `project_created`. Identify where users drop off after login.
3. **Team & project creation** — Trend of `team_created` and `project_created` events. Track growth in team/project adoption.
4. **Member invitation rate** — Trend of `member_invited` vs. `member_invite_failed`. Monitor onboarding of collaborators.
5. **Auth failure rate** — Trend of `sign_in_failed`. Watch for authentication issues or bot activity.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
