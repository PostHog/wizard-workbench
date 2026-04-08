<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. The following changes were made:

- **Installed** `posthog-js` as a dependency
- **Created** `src/app/@core/services/posthog.service.ts` — a singleton root service that wraps `posthog-js` with SSR-safe browser checks and a no-op proxy for server-side rendering
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` — added `posthogKey` and `posthogHost` fields reading from `NG_APP_*` environment variables
- **Created** `src/env.d.ts` — TypeScript declarations for `import.meta.env` to support Angular's `NG_APP_*` variable access
- **Updated** `src/app/app.component.ts` — initializes PostHog on app startup via `PostHogService.init()`
- **Updated** `src/app/auth/services/authentication.service.ts` — calls `posthog.identify()` and captures `user_logged_in` on successful login
- **Updated** `src/app/auth/logout/logout.component.ts` — captures `user_logged_out` and calls `posthog.reset()` on logout
- **Updated** `src/app/shared/components/create-project-modal/create-project-modal.component.ts` — captures `project_created` when a project is submitted
- **Updated** `src/app/shared/components/add-member-modal/add-member-modal.component.ts` — captures `team_member_invited` when a member is added
- **Updated** `src/app/pages/billing/billing.component.ts` + `billing.component.html` — captures `plan_upgrade_clicked` when a user clicks an upgrade button
- **Updated** `src/app/pages/profile/profile.component.ts` — captures `profile_updated` on profile save
- **Updated** `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` — captures `notification_preferences_saved` with preference details
- **Updated** `src/app/pages/settings/components/account-settings/account-settings.component.ts` — captures `account_settings_saved` with `password_changed` flag
- **Set** `.env` with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in; also calls `identify()` | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out; calls `posthog.reset()` | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_invited` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on a billing plan | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to track user behavior based on these events. Create it in PostHog at the links below:

- [New insight: User Logins over time](https://us.posthog.com/project/2/insights/new) — Trends for `user_logged_in` event
- [New insight: Login-to-Project funnel](https://us.posthog.com/project/2/insights/new) — Funnel from `user_logged_in` → `project_created`
- [New insight: Team invitations over time](https://us.posthog.com/project/2/insights/new) — Trends for `team_member_invited` event
- [New insight: Plan upgrade clicks](https://us.posthog.com/project/2/insights/new) — Trends for `plan_upgrade_clicked` broken down by `plan_name`
- [New insight: User churn / logouts](https://us.posthog.com/project/2/insights/new) — Trends for `user_logged_out` event

[Open PostHog project dashboard page](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
