# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The integration covers user identification on sign-in, screen tracking via React Navigation v7, and event capture across all major business flows: authentication, team management, project management, and member management. PostHog is initialized via a singleton client in `src/config/posthog.js` using environment variables loaded by `react-native-config`. The `PostHogProvider` is mounted inside `NavigationContainer` in `src/routes.js` with touch autocapture and manual screen tracking enabled.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in. Captures email and whether it's demo mode. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User attempted to sign in but received an invalid credentials error. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out, clearing their session. | `src/store/modules/auth/sagas.js` |
| `team_created` | User created a new team. Captures team name and ID. | `src/store/modules/teams/sagas.js` |
| `team_creation_failed` | Team creation failed due to an error. | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different active team. Captures team name and ID. | `src/store/modules/teams/sagas.js` |
| `project_created` | User created a new project within the active team. Captures title and team ID. | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | Project creation failed due to an error. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the team by email. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Member invitation failed due to an error. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin updated a team member's roles. | `src/store/modules/members/sagas.js` |

## Next steps

The PostHog API key used during setup lacked `dashboard:write` and `insight:write` scopes, so the **"Analytics basics (wizard)"** dashboard could not be created automatically. Create it manually at the links below with these five suggested insights:

1. **Sign-in funnel** — Funnel from `user_signed_in` → `team_selected` → `project_created` to measure onboarding conversion.
2. **Sign-in failures over time** — Trend of `sign_in_failed` events to monitor auth errors.
3. **Project creation rate** — Trend of `project_created` vs `project_creation_failed` to track success rate.
4. **Team growth** — Trend of `team_created` and `member_invited` to track team expansion.
5. **Churn signal** — Trend of `user_signed_out` events to monitor session drop-off.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] For iOS, run `cd ios && pod install` after the new native dependencies (`posthog-react-native`, `react-native-svg`, `react-native-config`) are added.
- [ ] Configure `react-native-config` for Android by following its setup guide: the `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` variables must be accessible from `BuildConfig` via the Gradle plugin.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login. If the stored token represents a real (non-demo) user, consider re-identifying on `init` using the stored email or a user-profile API call.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
