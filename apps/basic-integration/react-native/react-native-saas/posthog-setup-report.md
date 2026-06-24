<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Native SaaS application. The integration covers: a PostHog client configured from environment variables via `react-native-config`; a `PostHogProvider` and manual screen tracking wired into the existing `NavigationContainer` in `src/routes.js`; user identification on sign-in; and ten business-critical events captured across authentication, team, project, and member management sagas.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password. | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User attempted to sign in but received invalid credentials. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signs out and their session is cleared. | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | User attempted to create a team but an error occurred. | `src/store/modules/teams/sagas.js` |
| `team_switched` | User switches to a different active team. | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully creates a new project within a team. | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | User attempted to create a project but an error occurred. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User successfully invites a new member to the team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updates the role of an existing team member. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics (wizard):** https://us.posthog.com/project/483112/dashboard/1751155
- **Sign-in Success vs Failures:** https://us.posthog.com/project/483112/insights/EHUwPYNh
- **Activation Funnel: Sign In → Switch Team → Create Project:** https://us.posthog.com/project/483112/insights/Zjp3t4dy
- **Team and Project Creation:** https://us.posthog.com/project/483112/insights/kimqgMg9
- **Member Invitations:** https://us.posthog.com/project/483112/insights/OfsUiMDE
- **User Sign-out (Churn Signal):** https://us.posthog.com/project/483112/insights/Tlau238V

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] For iOS, run `cd ios && pod install` after adding `posthog-react-native`, `react-native-svg`, and `react-native-config` to pick up the new native modules.
- [ ] Confirm the returning-visitor path also calls `identify` — the `init` saga restores the session token but does not re-identify the user in PostHog; consider adding a `posthog.identify` call there so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
