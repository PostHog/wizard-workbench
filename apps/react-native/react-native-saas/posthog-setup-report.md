<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Here is a summary of all changes made:

**Dependencies installed:** `posthog-react-native`, `react-native-device-info`, `react-native-localize`, `react-native-svg`, and `react-native-config` were added for SDK functionality and environment variable support.

**Environment:** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were written to `.env` via `react-native-config`, which embeds them at build time (no runtime `.env` loading).

**PostHog client** (`src/config/posthog.js`): A singleton `posthog` instance was created with autocapture, lifecycle tracking, and debug mode in development.

**Provider** (`src/routes.js`): `PostHogProvider` was added inside `NavigationContainer` (required for React Navigation v7 compatibility). Manual screen tracking was wired up via `onReady` / `onStateChange` on `NavigationContainer` to call `posthog.screen()` on route changes.

**User identification** (`src/store/modules/auth/sagas.js`): `posthog.identify()` is called on successful sign-in to link the user's email to their PostHog identity. `posthog.reset()` is called on sign-out to clear the distinct ID.

**Event tracking:** 10 events were instrumented across 5 files (see table below). Error tracking via `$exception` was added to all saga catch blocks.

| Event | Description | File |
|---|---|---|
| `sign_in_viewed` | Sign in screen displayed — top of conversion funnel | `src/pages/SignIn/index.js` |
| `user_signed_in` | User successfully signed in (with identify) | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | Sign in attempt failed | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out (with reset) | `src/store/modules/auth/sagas.js` |
| `team_created` | New team successfully created | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `new_team_modal_opened` | User opened the new team creation modal | `src/components/TeamSwitcher/index.js` |
| `project_created` | New project successfully created | `src/store/modules/projects/sagas.js` |
| `member_invited` | Team member invitation sent | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Team member's role was changed | `src/store/modules/members/sagas.js` |

## Next steps

Visit your PostHog project to build an "Analytics basics" dashboard. Recommended insights to create:

1. **Sign-in conversion funnel** — Funnel: `sign_in_viewed` → `user_signed_in`. Measures how many users who land on the sign-in screen actually complete sign-in.
2. **Sign-in failures over time** — Trend: `sign_in_failed`. Monitor authentication issues and credential errors.
3. **Project creation trend** — Trend: `project_created`. Track product adoption and feature usage growth.
4. **Team activity** — Trend: `team_created` + `team_selected`. Understand workspace creation and switching behavior.
5. **Invitation funnel** — Trend: `member_invited` + `member_role_updated`. Track collaboration and team growth.

Your PostHog project: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
