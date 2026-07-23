<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Native SaaS project. The setup adds the `posthog-react-native` SDK with `react-native-config` for environment-variable-based configuration and `react-native-svg` as a required peer dependency. A PostHog singleton is initialised in `src/config/posthog.js` and mounted via `PostHogProvider` inside `NavigationContainer` in `src/routes.js`, enabling touch autocapture and manual screen tracking. Eight business events are captured directly in the Redux-Saga layer for tight coverage of all key user actions. User identification is performed on every sign-in using `posthog.identify()`, and `posthog.reset()` is called on sign-out to clear the distinct ID.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and signed in to the app. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User explicitly signed out of the app. | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | A sign-in attempt failed due to invalid credentials. | `src/store/modules/auth/sagas.js` |
| `project_created` | User created a new project within a team. | `src/store/modules/projects/sagas.js` |
| `team_created` | User created a new team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched the active team context. | `src/store/modules/teams/sagas.js` |
| `member_invited` | User invited a new member to the team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated the role of an existing team member. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.i.posthog.com/project/483112/dashboard/1897501
- Sign-in funnel: https://us.i.posthog.com/project/483112/insights/KVqcnHfH
- Sign-ins over time: https://us.i.posthog.com/project/483112/insights/qzkxe7Dy
- Sign-ins by demo vs real: https://us.i.posthog.com/project/483112/insights/I4IeeAuv
- Projects created: https://us.i.posthog.com/project/483112/insights/KT8OjxHI
- Team member actions: https://us.i.posthog.com/project/483112/insights/BgzN5C7u

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh sign-in; a session restored via the stored token on app restart does not re-identify the user, leaving returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
