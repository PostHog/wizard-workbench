<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here's a summary of all changes made:

- **Installed** `posthog-js` as a project dependency.
- **Created** `src/app/services/posthog.service.ts` — a singleton root service that wraps the PostHog SDK with SSR safety (`isPlatformBrowser` check) and runs initialization outside the Angular zone to avoid unnecessary change detection cycles.
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` to include `posthogKey` and `posthogHost` fields sourced from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` environment variables.
- **Created** `src/env.d.ts` — TypeScript declaration for `import.meta.env` to support Angular's `NG_APP_*` environment variable pattern.
- **Created** `.env` — contains the PostHog project token and host (excluded from git).
- **Updated** `src/app/app.component.ts` — injects `PostHogService` and calls `posthogService.init()` in `ngOnInit`.
- **Updated** `src/app/auth/services/authentication.service.ts` — calls `posthog.identify()` on login with user properties, captures `user_logged_in`, and captures `user_logged_out` + `posthog.reset()` on logout.
- **Updated** 7 additional component files to capture business events (see table below).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out | `src/app/auth/services/authentication.service.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | User clicks to upgrade to a billing plan | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves their profile information | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |

## Next steps

To create an "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboards) and create a new dashboard with these recommended insights:

1. **Login funnel** — Funnel insight from `user_logged_in` → `project_created` to measure activation.
2. **Project creation trend** — Trends insight with `project_created` event to track team growth over time.
3. **Billing plan upgrades** — Trends insight with `billing_plan_selected` to monitor upgrade activity, broken down by `plan_name`.
4. **Team member additions** — Trends insight with `team_member_added` to track team expansion, broken down by `member_role`.
5. **User retention** — Retention insight: returning to `user_logged_in` after `user_logged_in` to monitor engagement.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
