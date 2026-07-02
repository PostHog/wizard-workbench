# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The integration adds the PostHog SDK (`posthog-react-native`) with a shared client instance configured via environment variables. `PostHogProvider` is placed inside `NavigationContainer` in `src/routes.js` for React Navigation v7 compatibility, with manual screen tracking via `onStateChange`. Ten business events are captured across four Redux saga modules covering the full user lifecycle: authentication, team management, project creation, and member management. User identification (`posthog.identify`) is called at sign-in to correlate all subsequent events to a specific user. Error tracking (`posthog.captureException`) is added at sign-in failures and key saga error boundaries.

## Events added

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and signed in to the app. | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | User attempted to sign in but authentication failed with invalid credentials. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out and their session was cleared. | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully created a new team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team from the team switcher. | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project within the active team. | `src/store/modules/projects/sagas.js` |
| `project_creation_failed` | An error occurred while trying to create a new project. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User invited a new member to the active team via email. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | An error occurred while trying to invite a new member. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Administrator updated the role of an existing team member. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1792565)
- **Sign-in conversion funnel**: [https://us.i.posthog.com/project/483112/insights/LcSw1rEt](https://us.i.posthog.com/project/483112/insights/LcSw1rEt)
- **User sign-ins over time**: [https://us.i.posthog.com/project/483112/insights/jpENHSAN](https://us.i.posthog.com/project/483112/insights/jpENHSAN)
- **Projects created over time**: [https://us.i.posthog.com/project/483112/insights/4Umy57fR](https://us.i.posthog.com/project/483112/insights/4Umy57fR)
- **Members invited over time**: [https://us.i.posthog.com/project/483112/insights/m1UQC2o2](https://us.i.posthog.com/project/483112/insights/m1UQC2o2)
- **Teams created over time**: [https://us.i.posthog.com/project/483112/insights/QGwxqJ98](https://us.i.posthog.com/project/483112/insights/QGwxqJ98)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `init` saga restores the token but does not re-identify the user in PostHog after an app restart. Consider calling `posthog.identify` with the stored email when a session is restored.
- [ ] After installing native dependencies (`react-native-config`, `react-native-svg`), run `pod install` in the `ios/` directory for iOS builds.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
