<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Native SaaS app. The integration adds event tracking across authentication, team management, project management, and member management flows. PostHog is initialized using `posthog-react-native` with environment variables loaded via `react-native-config`. The `PostHogProvider` is placed inside `NavigationContainer` (required for React Navigation v7), with manual screen tracking via `onReady`/`onStateChange` callbacks.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully signs in, capturing whether they used demo mode. | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | Fires when a sign-in attempt fails due to invalid credentials. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fires when a user signs out and their session is cleared. | `src/store/modules/auth/sagas.js` |
| `team_selected` | Fires when the user switches to a different team in the team switcher. | `src/store/modules/teams/sagas.js` |
| `team_created` | Fires when a user successfully creates a new team. | `src/store/modules/teams/sagas.js` |
| `project_created` | Fires when a user successfully creates a new project within a team. | `src/store/modules/projects/sagas.js` |
| `project_create_failed` | Fires when a project creation attempt fails due to an API error. | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fires when a user successfully sends an invitation to a new team member. | `src/store/modules/members/sagas.js` |
| `member_invite_failed` | Fires when a member invite attempt fails due to an API error. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fires when an administrator changes a team member's roles. | `src/store/modules/members/sagas.js` |

## Files changed

- **`src/config/posthog.js`** *(created)* — PostHog client instance configured with `react-native-config` env vars, graceful fallback when token is missing.
- **`src/routes.js`** — Added `PostHogProvider` inside `NavigationContainer` with manual screen tracking for React Navigation v7.
- **`src/store/modules/auth/sagas.js`** — Added `posthog.identify()` on sign-in, plus `user_signed_in`, `user_sign_in_failed`, `user_signed_out` events and `posthog.reset()` on sign-out.
- **`src/store/modules/teams/sagas.js`** — Added `team_created` and `team_selected` events.
- **`src/store/modules/projects/sagas.js`** — Added `project_created` and `project_create_failed` events.
- **`src/store/modules/members/sagas.js`** — Added `member_invited`, `member_invite_failed`, and `member_role_updated` events.
- **`.env`** *(created)* — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

## Packages installed

- `posthog-react-native` — PostHog SDK for React Native
- `react-native-config` — Loads `.env` variables at build time
- `react-native-device-info` — Required peer dependency
- `react-native-localize` — Required peer dependency
- `react-native-svg` — Required peer dependency (surveys feature)

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824579)
- **Sign-ins over time**: [rIJtgXbu](https://us.posthog.com/project/483112/insights/rIJtgXbu)
- **Sign-in success vs failure**: [uoQmwoVX](https://us.posthog.com/project/483112/insights/uoQmwoVX)
- **Project creation funnel**: [sT7dcCMX](https://us.posthog.com/project/483112/insights/sT7dcCMX)
- **Team and project activity**: [9ASRxlo5](https://us.posthog.com/project/483112/insights/9ASRxlo5)
- **User churn (sign-outs) over time**: [w2sx0sGW](https://us.posthog.com/project/483112/insights/w2sx0sGW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any CI/CD scripts so collaborators know what to set.
- [ ] For iOS: run `cd ios && pod install && cd ..` to link the newly installed native dependencies (`react-native-config`, `react-native-device-info`, `react-native-localize`, `react-native-svg`).
- [ ] For Android: rebuild the project so Gradle picks up the new native modules.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login; ensure re-authentication after session restore (e.g. token refresh) also calls `posthog.identify()` with the correct user ID.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
