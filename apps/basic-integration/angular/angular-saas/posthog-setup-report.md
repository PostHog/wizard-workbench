<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular SaaS project. PostHog is now initialized in the root `AppComponent` using a dedicated `PostHogService` singleton (SSR-safe via `isPlatformBrowser` checks). Environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`) are read from a `.env` file using Angular's native `import.meta.env` support. Session replay and exception capture (`capture_exceptions: true`) are enabled. User identification is performed on login and the PostHog identity is reset on logout.

**Files created:**
- `src/app/services/posthog.service.ts` — Injectable singleton service wrapping posthog-js with SSR safety
- `src/env.d.ts` — TypeScript declarations for `import.meta.env` PostHog variables
- `.env` — PostHog token and host (git-ignored)

**Files modified:**
- `src/environments/environment.ts` + `environment.prod.ts` — Added `posthogKey` and `posthogHost`
- `src/app/app.component.ts` — PostHog initialization on app startup
- `src/app/auth/login/login.component.ts` — User identification and login event
- `src/app/auth/logout/logout.component.ts` — Logout event and identity reset
- Plus 8 feature component files (see event table below)

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a team member is added to the workspace | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects a billing plan upgrade | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `2fa_toggled` | Fired when a user enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `preferences_saved` | Fired when a user saves their display preferences | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `user_list_member_clicked` | Fired when a user clicks on a team member in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've instrumented your key user flows. Head to PostHog to create your "Analytics basics (wizard)" dashboard with insights for the events above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — Create a new dashboard named "Analytics basics (wizard)"
- [Create New Insight](https://us.posthog.com/project/2/insights/new) — Suggested insights to add:
  - **Login funnel** — Trend of `user_logged_in` over time
  - **Billing conversion** — `billing_plan_selected` broken down by `plan_name`
  - **Team growth** — Trend of `team_member_added` over time
  - **Project creation rate** — Trend of `project_created` over time
  - **Security engagement** — Trend of `2fa_toggled` broken down by `enabled`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
