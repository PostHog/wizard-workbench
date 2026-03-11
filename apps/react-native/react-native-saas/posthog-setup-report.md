<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **Installed packages**: `posthog-react-native`, `react-native-svg` (peer dep), and `react-native-config` (for build-time env var injection)
- **Environment variables**: Created `.env` with `POSTHOG_API_KEY` and `POSTHOG_HOST`; added `.env` to `.gitignore`
- **PostHog config** (`src/config/posthog.js`): Instantiates the PostHog client using env vars via `react-native-config`, with `captureAppLifecycleEvents`, debug mode in dev, and graceful disabling when key is missing
- **Provider setup** (`src/routes.js`): `PostHogProvider` added inside `NavigationContainer` (required for React Navigation v7), with screen-change tracking via `onStateChange` and touch autocapture enabled
- **Auth sagas** (`src/store/modules/auth/sagas.js`): `posthog.identify()` on sign-in (both demo and real mode), `user_signed_in` event, `user_signed_out` event, `posthog.reset()` on sign-out, exception capture on sign-in failure
- **Teams sagas** (`src/store/modules/teams/sagas.js`): `team_selected` and `team_created` events with team name/ID properties; exception capture on create failure
- **Projects sagas** (`src/store/modules/projects/sagas.js`): `project_created` event with project title, ID, and team context; exception capture on failure
- **Members sagas** (`src/store/modules/members/sagas.js`): `member_invited` event with email and team context; `member_role_updated` event with member ID and role names; exception capture on failures

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in. Also calls `posthog.identify()` to associate session with user. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out. Also calls `posthog.reset()` to clear the session. | `src/store/modules/auth/sagas.js` |
| `team_selected` | User switched to a different team. | `src/store/modules/teams/sagas.js` |
| `team_created` | User created a new team. | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team by email. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updated the roles of a team member. | `src/store/modules/members/sagas.js` |

## Next steps

To complete the setup, two native linking steps are required for the new packages:

### iOS
```bash
cd ios && pod install
```

### Android
`react-native-config` requires adding the following to `android/app/build.gradle`:
```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

### Dashboard

To get full observability, create a new dashboard in PostHog at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) named **"Analytics basics"** with the following suggested insights:

1. **Sign-in funnel** — Funnel: `user_signed_in` → `team_selected` → `project_created`. Measures onboarding conversion after login.
2. **Daily active users** — Trend of `user_signed_in` unique users over time. Core engagement signal.
3. **Churn signal: sign-outs** — Trend of `user_signed_out` events. Spike may indicate problems or session timeout issues.
4. **Team and project growth** — Bar chart of `team_created` and `project_created` events over time. Measures feature adoption.
5. **Member collaboration** — Trend of `member_invited` and `member_role_updated` events. Tracks collaboration activity.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
