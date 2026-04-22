<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for this Angular 21 SaaS application. Here is a summary of all changes made:

**New files created:**
- `src/app/services/posthog.service.ts` — Singleton root service wrapping posthog-js, initialized outside the Angular zone via `NgZone.runOutsideAngular` for optimal performance with session recording. Exposes the raw `posthog` instance for direct use in components.

**Modified files:**
- `src/environments/.env.ts` — Added `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` keys.
- `src/environments/environment.ts` — Added `posthogKey` and `posthogHost` properties.
- `src/environments/environment.prod.ts` — Added `posthogKey` and `posthogHost` properties.
- `src/app/app.component.ts` — Injected `PosthogService` to trigger initialization at app startup.
- `src/app/auth/login/login.component.ts` — Added `posthog.identify()` and `user_logged_in` capture on successful login.
- `src/app/auth/logout/logout.component.ts` — Added `user_logged_out` capture and `posthog.reset()` on logout.
- `src/app/pages/billing/billing.component.ts` — Added `plan_selected` capture with plan details; wired button click in template.
- `src/app/pages/settings/components/account-settings/account-settings.component.ts` — Added `account_settings_saved` capture and `delete_account_clicked` capture (churn signal).
- `src/app/pages/settings/components/security-settings/security-settings.component.ts` — Added `two_factor_toggled` capture with enabled state.
- `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` — Added `notification_preferences_saved` capture with all preference values.
- `src/app/shared/components/create-project-modal/create-project-modal.component.ts` — Added `project_created` capture with project name and status.
- `src/app/shared/components/add-member-modal/add-member-modal.component.ts` — Added `member_added` capture with member role.

**Environment:**
- `.env` file created with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` (gitignored).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; also calls `identify()` | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out; also calls `posthog.reset()` | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `delete_account_clicked` | Fired when a user clicks Delete Account (churn signal) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `plan_selected` | Fired when a user selects a billing plan (conversion) | `src/app/pages/billing/billing.component.ts` |

## Next steps

Visit your PostHog project to explore the data once events start flowing. We recommend building these insights in an "Analytics basics" dashboard:

- https://us.posthog.com/project/2/insights — **Login funnel**: `user_logged_in` → `project_created` (activation funnel)
- https://us.posthog.com/project/2/insights — **Plan conversion**: `plan_selected` trend broken down by `plan_name`
- https://us.posthog.com/project/2/insights — **Churn signal**: `delete_account_clicked` trend over time
- https://us.posthog.com/project/2/insights — **Team growth**: `member_added` trend broken down by `member_role`
- https://us.posthog.com/project/2/insights — **Security adoption**: `two_factor_toggled` where `enabled = true`
- https://us.posthog.com/project/2/dashboard — Create your "Analytics basics" dashboard and pin these insights there

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
