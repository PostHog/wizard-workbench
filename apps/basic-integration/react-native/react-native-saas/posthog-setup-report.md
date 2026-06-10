<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The following changes were made:

- **`src/config/posthog.js`** (new): PostHog client singleton, configured via `react-native-config` environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`). Gracefully disables analytics if no token is configured.
- **`src/routes.js`**: Added `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility), manual screen tracking via `onStateChange`, and touch autocapture.
- **`src/store/modules/auth/sagas.js`**: Added `posthog.identify()` on sign-in, `user_signed_in` capture, `user_signed_out` capture, `posthog.reset()` on sign-out, and `captureException` on sign-in errors.
- **`src/store/modules/teams/sagas.js`**: Added `team_created` and `team_selected` events, plus `captureException` on errors.
- **`src/store/modules/projects/sagas.js`**: Added `project_created` event with project and team context, plus `captureException` on errors.
- **`src/store/modules/members/sagas.js`**: Added `member_invited` and `member_role_updated` events, plus `captureException` on errors.
- **`.env`** (new): `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out of the app | `src/store/modules/auth/sagas.js` |
| `team_created` | User creates a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User creates a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invites a new member to a team | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updates a team member's role | `src/store/modules/members/sagas.js` |

## Next steps

We've prepared the event tracking. To build a dashboard named **"Analytics basics (wizard)"**, head to PostHog and create insights for these key business metrics:

1. **Sign-in trend** — Trends chart of `user_signed_in` over time, broken down by `is_demo`
2. **Sign-in → team selected funnel** — Funnel: `user_signed_in` → `team_selected` → `project_created` (new user onboarding conversion)
3. **Project creation trend** — Trends chart of `project_created` over time, grouped by team
4. **Member invites trend** — Trends chart of `member_invited` over time (team growth signal)
5. **Sign-out / churn** — Trends chart of `user_signed_out` over time

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

> Note: For iOS, run `cd ios && pod install` after installing the new native packages (`posthog-react-native`, `react-native-svg`, `react-native-config`).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
