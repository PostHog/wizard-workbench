<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The integration installs `posthog-react-native` with its required peer dependencies (`react-native-device-info`, `react-native-localize`, `react-native-config`, `react-native-svg`), configures a PostHog client singleton using environment variables, wraps the navigation stack with `PostHogProvider` (placed inside `NavigationContainer` for React Navigation v7 compatibility), adds manual screen tracking via `onStateChange`, identifies users on sign-in, and captures key business events across auth, team, project, and member management flows.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to the app. | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User attempted to sign in but credentials were invalid. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the app. | `src/store/modules/auth/sagas.js` |
| `team_selected` | User switched the active team. | `src/store/modules/teams/sagas.js` |
| `team_created` | User successfully created a new team. | `src/store/modules/teams/sagas.js` |
| `team_create_failed` | User attempted to create a team but it failed. | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project. | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | User attempted to create a project but it failed. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User successfully invited a new member to the team. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | User attempted to invite a member but the invite failed. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Admin successfully updated a team member's role. | `src/store/modules/members/sagas.js` |
| `member_role_update_failed` | Admin attempted to update a member role but it failed. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1825419)
- [Sign-in trend](https://us.posthog.com/project/483112/insights/NLDBwTsR) — daily sign-ins vs failed sign-in attempts
- [Sign-in to team selection funnel](https://us.posthog.com/project/483112/insights/qGuk3PlA) — conversion funnel from sign-in → team selection → project creation
- [Project and team creation trend](https://us.posthog.com/project/483112/insights/BaU389aw) — daily projects and teams created
- [Member invitation success vs failure](https://us.posthog.com/project/483112/insights/G8Vu1ce5) — invite success and failure rates
- [Churn — sign-outs trend](https://us.posthog.com/project/483112/insights/WYlk1bCA) — daily unique users signing out

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login. For users restored from `AsyncStorage` on app restart (the `init` saga), consider calling `posthog.identify` with the stored token/email if available, so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
