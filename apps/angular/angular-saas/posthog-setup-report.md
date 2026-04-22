<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. Here is a summary of what was done:

- **PostHog service** created as a singleton root-level service (`src/app/services/posthog.service.ts`) with SSR-safety via `isPlatformBrowser` checks and a no-op proxy for server-side rendering.
- **PostHog initialized** in `AppComponent.ngOnInit()` using environment-configured API key and host, with `capture_exceptions: true` for automatic error tracking.
- **Environment configuration** added `posthogKey` and `posthogHost` to both `environment.ts` and `environment.prod.ts`, reading from `import.meta.env` via `.env` file support (Angular 21 Vite builder).
- **User identification** added in `AuthenticationService.login()` using `posthog.identify()` with the user's ID, username, and email. `posthog.reset()` is called on logout.
- **10 events** instrumented across 8 files covering auth, project management, billing, profile, settings, and dashboard interactions.
- **Type declarations** added in `src/env.d.ts` for `import.meta.env` PostHog variables.
- **`posthog-js` package** installed as a project dependency.

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out of the application | `src/app/auth/services/authentication.service.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | User selects a billing plan | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `tfa_toggled` | User enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | User clicks a dashboard quick action | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

Visit your PostHog project to build insights and dashboards based on the events we just instrumented:

- [PostHog Project — Events](https://us.posthog.com/project/2/events)
- [PostHog Project — Insights](https://us.posthog.com/project/2/insights)
- [PostHog Project — Dashboards](https://us.posthog.com/project/2/dashboards)

Suggested insights to create in an "Analytics basics" dashboard:
1. **Login funnel** — trend of `user_logged_in` over time
2. **Project creation rate** — trend of `project_created`, grouped by `project_status`
3. **Billing plan conversion** — funnel from `user_logged_in` → `billing_plan_selected`
4. **Team growth** — trend of `team_member_added`, grouped by `member_role`
5. **Security engagement** — combined trend of `tfa_toggled` and `session_revoked`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
