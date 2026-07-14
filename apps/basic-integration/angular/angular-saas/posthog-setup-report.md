# PostHog post-wizard report

The wizard completed a PostHog integration for this Angular application by installing `posthog-js`, adding a singleton `PostHogService`, wiring initialization into the root app component, and reading the PostHog token and host from Angular environment configuration backed by `.env`. It also added client-side identification on authenticated sessions, custom product analytics events across key dashboard, billing, profile, and security flows, plus exception and API error capture through the global HTTP interceptor. Verification was performed with a scoped production build.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful authentication after a user signs in. | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Captures when an authenticated user signs out of the application. | `src/app/auth/services/authentication.service.ts` |
| `project_created` | Captures when a user creates a new project from the dashboard flow. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Captures when a user adds a new team member from the dashboard. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Captures when a user selects a billing plan in the billing page. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Captures when a user saves updated profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Captures when a user saves account settings changes. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | Captures when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Captures when a user revokes an active device session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_sessions_revoked` | Captures when a user revokes all other active sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `dashboard_quick_action_used` | Captures when a user triggers a dashboard quick action. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `frontend_api_error` | Captures client-side request errors handled by the global interceptor. | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We've built some insights and a dashboard for monitoring the newly instrumented product flows:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846681)
- [Successful logins (wizard)](https://us.posthog.com/project/483112/insights/rGv6u1pm)
- [Project creation funnel (wizard)](https://us.posthog.com/project/483112/insights/nSpl1IAw)
- [Quick actions used (wizard)](https://us.posthog.com/project/483112/insights/xYiOt6HM)
- [Billing plans selected (wizard)](https://us.posthog.com/project/483112/insights/H0ECmTZY)
- [Account recovery actions (wizard)](https://us.posthog.com/project/483112/insights/v42Plssl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project under `.claude/skills/integration-angular`. This can be reused for future agent-assisted PostHog work so implementation patterns stay aligned with current guidance.
