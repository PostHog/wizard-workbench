<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Native SaaS app. The integration covers user identification, seven key business events across auth, teams, projects, and members workflows, screen tracking via React Navigation v7, and autocapture for touch events. The PostHog singleton is configured via `react-native-config` so tokens are embedded at build time from `.env` and never hardcoded.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired on successful sign-in; also calls `posthog.identify()` with the user's email | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Fired on sign-out; also calls `posthog.reset()` to clear the identity | `src/store/modules/auth/sagas.js` |
| `team_created` | Fired when a new team is created successfully | `src/store/modules/teams/sagas.js` |
| `team_selected` | Fired when the user switches to a different team | `src/store/modules/teams/sagas.js` |
| `project_created` | Fired when a new project is created within a team | `src/store/modules/projects/sagas.js` |
| `member_invited` | Fired when a team member invitation is sent | `src/store/modules/members/sagas.js` |
| `member_role_updated` | Fired when a member's roles are changed | `src/store/modules/members/sagas.js` |

## Next steps

We were unable to create the PostHog dashboard automatically because the MCP connection lacked write scopes. To create the suggested "Analytics basics (wizard)" dashboard manually, navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and add these insights:

1. **Sign-in trend** — Trends: `user_signed_in` over time. Shows daily/weekly active sign-ins.
2. **Sign-in → team selected funnel** — Funnel: `user_signed_in` → `team_selected`. Shows how many users engage with teams after signing in.
3. **Team & project creation** — Trends: `team_created` and `project_created` on the same chart. Tracks onboarding depth.
4. **Member collaboration** — Trends: `member_invited` + `member_role_updated`. Measures collaborative activity.
5. **Churn signal** — Trends: `user_signed_out` over time. Baseline for session drop-off.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `init` saga in `auth/sagas.js` restores a token from AsyncStorage but does not re-identify the user in PostHog. Consider adding a `posthog.identify()` call there once the stored email is available.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
