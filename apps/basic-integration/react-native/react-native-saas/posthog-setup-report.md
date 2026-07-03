<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Here's what was done:

- **Installed** `posthog-react-native`, `react-native-config`, and `react-native-svg` (required peer dependency).
- **Created** `src/config/posthog.js` — a singleton PostHog client configured via `react-native-config` environment variables, with autocapture, lifecycle events, and debug mode in development.
- **Updated** `src/routes.js` — added `PostHogProvider` inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onStateChange` and `onReady`.
- **Updated** auth, teams, projects, and members Redux sagas — `posthog.capture()` calls for all key business events, `posthog.identify()` on sign-in, `posthog.reset()` on sign-out, and `posthog.captureException()` in all error catch blocks.
- **Configured** `.env` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in, capturing whether it was demo mode. | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Fired when a sign-in attempt fails with invalid credentials. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out of the app. | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a user successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `team_switched` | Fired when a user switches to a different active team. | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a user successfully creates a new project within a team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a user invites a new member to the active team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when an administrator updates a member's role within a team. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793520)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/gc6r559w)
- [Sign-in failures](https://us.posthog.com/project/483112/insights/zMMujflJ)
- [Teams and projects created](https://us.posthog.com/project/483112/insights/unrmNraC)
- [Member invitations](https://us.posthog.com/project/483112/insights/iknafHdV)
- [Sign-out rate](https://us.posthog.com/project/483112/insights/eblpm7HL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding/bootstrap scripts so collaborators know what to set.
- [ ] For iOS, run `cd ios && pod install` after adding the new native dependencies (`posthog-react-native`, `react-native-config`, `react-native-svg`).
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login and session restore via `init`, but verify this covers all re-entry paths in your app.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
