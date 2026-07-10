<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the Angular application with a singleton service, initialized from environment-backed configuration in the root app component, and wired into key authenticated product flows. The integration now captures login/logout activity, dashboard workflow entry points, project creation, team-member invites, billing plan selection, profile and account updates, security actions, and frontend exception reporting through the shared HTTP error interceptor. A build was run successfully after the changes.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Captures when a user successfully signs in and reaches the authenticated workspace. | `src/app/auth/login/login.component.ts` |
| user_login_failed | Captures when a login attempt fails because the authentication request returns an error. | `src/app/auth/login/login.component.ts` |
| user_logged_out | Captures when an authenticated user signs out of the application. | `src/app/auth/logout/logout.component.ts` |
| create_project_modal_opened | Captures when a user opens the create project workflow from the dashboard. | `src/app/pages/dashboard/dashboard.component.ts` |
| add_member_modal_opened | Captures when a user opens the add member workflow from the dashboard. | `src/app/pages/dashboard/dashboard.component.ts` |
| project_created | Captures when a new project is created from the dashboard modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| team_member_added | Captures when a new team member is added from the workspace modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| billing_plan_selected | Captures when a user selects an upgrade path from the billing page. | `src/app/pages/billing/billing.component.ts` |
| profile_updated | Captures when a user saves edits to their profile. | `src/app/pages/profile/profile.component.ts` |
| account_settings_saved | Captures when a user saves account settings changes. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| two_factor_toggled | Captures when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| session_revoked | Captures when a user revokes an existing session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| all_other_sessions_revoked | Captures when a user revokes all non-current sessions from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831025)
- [Logins and logouts over time (wizard)](https://us.posthog.com/project/483112/insights/xmpenH2l)
- [Team growth actions by role (wizard)](https://us.posthog.com/project/483112/insights/RoCTfKsq)
- [Plan selections by tier (wizard)](https://us.posthog.com/project/483112/insights/uQw5qzRw)
- [Security controls usage (wizard)](https://us.posthog.com/project/483112/insights/PSOI64Q6)
- [Profile and account updates (wizard)](https://us.posthog.com/project/483112/insights/ZNH1VCuz)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
