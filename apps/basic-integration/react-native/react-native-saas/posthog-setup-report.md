<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS application. Here is a summary of all changes made:

**New files created:**
- `src/services/posthog.js` — Standalone PostHog client instance using `react-native-config` to load credentials from `.env`
- `.env` — Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (added to `.gitignore`)

**Modified files:**
- `src/routes.js` — Added `PostHogProvider` (with `autocapture` enabled) inside `NavigationContainer` for screen tracking and touch autocapture
- `src/store/modules/auth/sagas.js` — User identification on login, `posthog.reset()` on logout, and event capture
- `src/store/modules/teams/sagas.js` — Event capture for team creation and selection
- `src/store/modules/projects/sagas.js` — Event capture for project creation
- `src/store/modules/members/sagas.js` — Event capture for member invitation and role updates

**Packages installed (background):**
- `posthog-react-native` — PostHog React Native SDK
- `react-native-device-info` — Required peer dependency
- `react-native-localize` — Required peer dependency
- `react-native-config` — Loads env vars at build time
- `react-native-svg` — Required peer dependency for surveys feature

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `src/store/modules/auth/sagas.js` |
| `user_sign_in_failed` | User sign-in attempt failed due to invalid credentials | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | User signed out of the application | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully created a new team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switched to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully created a new project within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | User sent an invitation to a new team member | `src/store/modules/members/sagas.js` |
| `member_role_updated` | User updated the role of an existing team member | `src/store/modules/members/sagas.js` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights based on the events we just instrumented. You can use these links to get started quickly:

1. **[Daily sign-ins (trend)](https://us.posthog.com/project/2/insights/new)** — Trend of `user_signed_in` over time. Shows user growth and engagement.

2. **[Sign-in failure rate (trend)](https://us.posthog.com/project/2/insights/new)** — Trend of `user_sign_in_failed`. High rates may indicate UX or credential issues.

3. **[Onboarding funnel (funnel)](https://us.posthog.com/project/2/insights/new)** — Conversion from `user_signed_in` → `team_selected` → `project_created`. Identifies drop-off in the onboarding flow.

4. **[Team & project creation (trend)](https://us.posthog.com/project/2/insights/new)** — Combined trend of `team_created` and `project_created`. Tracks activation and expansion.

5. **[Member invitation trend (trend)](https://us.posthog.com/project/2/insights/new)** — Trend of `member_invited`. Tracks virality and team growth.

Visit your [PostHog dashboards](https://us.posthog.com/project/2/dashboards) to create the "Analytics basics" dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-native/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
