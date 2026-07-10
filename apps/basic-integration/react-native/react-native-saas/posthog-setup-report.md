# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. The following changes were made:

- **Installed** `posthog-react-native`, `react-native-config`, and `react-native-svg` packages.
- **Created** `src/config/posthog.js` — PostHog client singleton loaded from `.env` via `react-native-config`, with graceful disable when the token is missing.
- **Updated** `src/routes.js` — added `PostHogProvider` (inside `NavigationContainer` for React Navigation v7 compatibility) with manual screen tracking via `onStateChange`, and touch autocapture enabled.
- **Updated** `src/store/modules/auth/sagas.js` — `posthog.identify()` on sign-in (using email as distinct ID), `user_signed_in` and `user_signed_out` capture events, `posthog.reset()` on sign-out, and `posthog.captureException()` on sign-in failure.
- **Updated** `src/store/modules/teams/sagas.js` — `team_created` and `team_switched` events, plus `captureException` on team creation failure.
- **Updated** `src/store/modules/projects/sagas.js` — `project_created` event with project title, plus `captureException` on project creation failure.
- **Updated** `src/store/modules/members/sagas.js` — `member_invited` and `member_role_updated` events, plus `captureException` on each failure path.
- **Created** `.env` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (`.gitignore` coverage added automatically).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in to the app. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired when a user signs out of the app. | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a user successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `team_switched` | Fired when a user selects a different active team. | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a user successfully creates a new project within a team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a user successfully invites a new member to the team. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a user updates an existing member's role within the team. | `src/store/modules/members/sagas.js` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behaviour:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829315)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/2vvTMFng) — daily `user_signed_in` volume over the last 30 days.
- [Sign-in to team creation funnel](https://us.posthog.com/project/483112/insights/YpkuGd00) — conversion from sign-in → team creation; the primary activation funnel.
- [Team & project creation trend](https://us.posthog.com/project/483112/insights/pKvC09Nh) — bar chart of team and project creation side-by-side.
- [Member collaboration activity](https://us.posthog.com/project/483112/insights/7AVmsPNI) — weekly member invite and role-update volume.
- [Sign-out (churn signal) trend](https://us.posthog.com/project/483112/insights/yobrwbOr) — daily sign-out count; spikes indicate drop-off or UX friction.

Dashboard subscription and alerts were not configured (consent prompt unavailable in this environment). You can set these up manually from the dashboard page in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `init` saga re-identifies from the stored token, but verify this is working correctly in both fresh login and session-restore flows.
- [ ] iOS: run `cd ios && pod install` to link the newly added native modules (`posthog-react-native`, `react-native-config`, `react-native-svg`).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
