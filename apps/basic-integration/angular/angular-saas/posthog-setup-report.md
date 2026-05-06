<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here is a summary of every change made:

- **Created** `src/app/services/posthog.service.ts` — a singleton root service wrapping posthog-js with SSR-safe browser checks and a no-op proxy for server contexts.
- **Modified** `src/app/app.component.ts` — initializes PostHog on app startup using `posthogService.init()` with credentials from environment variables.
- **Modified** `src/environments/environment.ts` and `src/environments/environment.prod.ts` — added `posthogKey` and `posthogHost` fields sourced from `src/environments/.env.ts`.
- **Modified** `src/environments/.env.ts` — added `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` placeholder keys (real values in `.env`).
- **Modified** `src/app/auth/services/authentication.service.ts` — calls `posthog.identify()` with user ID and properties on login, and fires `user_logged_in`. Also captures `user_logged_out` and calls `posthog.reset()` in the logout component.
- **Modified** `src/app/auth/logout/logout.component.ts` — captures `user_logged_out` and resets the PostHog identity on logout.
- **Modified** `src/app/pages/billing/billing.component.ts` and `.html` — added `selectPlan()` method that captures `plan_upgrade_clicked` with plan details when a user selects a new plan.
- **Modified** `src/app/shared/components/create-project-modal/create-project-modal.component.ts` — captures `project_created` with project name and status on form submission.
- **Modified** `src/app/shared/components/add-member-modal/add-member-modal.component.ts` — captures `member_added` with the member's role on submission.
- **Modified** `src/app/pages/settings/components/account-settings/account-settings.component.ts` — captures `account_settings_saved` including whether a password change was attempted.
- **Modified** `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` — captures `notification_preferences_saved` with all notification toggle states.
- **Modified** `src/app/pages/settings/components/security-settings/security-settings.component.ts` — captures `two_factor_auth_toggled` with the new enabled state.
- **Modified** `src/app/pages/profile/profile.component.ts` — captures `profile_updated` when the user saves their profile.
- **Modified** `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` — captures `quick_action_clicked` with action ID and label for every dashboard quick action.

## Event tracking summary

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks to change their billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `profile_updated` | Fired when a user updates their profile | `src/app/pages/profile/profile.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Login → Project Creation funnel** — Funnel insight with steps `user_logged_in` → `project_created` to measure onboarding conversion.
2. **Plan upgrade clicks over time** — Trends insight on `plan_upgrade_clicked`, broken down by `plan_name` to see which plans attract the most interest.
3. **New members added** — Trends insight on `member_added`, broken down by `member_role` to understand team growth patterns.
4. **Daily active users** — Trends insight counting unique users firing `user_logged_in` per day.
5. **Quick action usage breakdown** — Trends insight on `quick_action_clicked` broken down by `action_label` to see what users do most on the dashboard.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
