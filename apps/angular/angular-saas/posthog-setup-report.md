<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. Here's a summary of all changes made:

**New files created:**
- `src/app/@core/services/posthog.service.ts` — SSR-safe PostHog wrapper service (singleton, `providedIn: 'root'`)
- `src/env.d.ts` — TypeScript declarations for `import.meta.env` (NG_APP_* variables)
- `apps/angular/angular-saas/.env` — PostHog credentials (token + host)

**Modified files:**
- `src/environments/environment.ts` — Added `posthogKey` and `posthogHost` from env vars
- `src/environments/environment.prod.ts` — Added `posthogKey` and `posthogHost` from env vars
- `src/app/@core/services/index.ts` — Exported `PostHogService`
- `src/app/app.component.ts` — Initialized PostHog SDK in `ngOnInit`
- `src/app/auth/services/authentication.service.ts` — Identify user + `user_logged_in` on login
- `src/app/auth/logout/logout.component.ts` — `user_logged_out` + `posthog.reset()` on logout
- `src/app/pages/billing/billing.component.ts` — `plan_upgraded` on plan selection
- `src/app/pages/billing/billing.component.html` — Wired `selectPlan()` click handler
- `src/app/shared/components/create-project-modal/create-project-modal.component.ts` — `project_created` on submit
- `src/app/shared/components/add-member-modal/add-member-modal.component.ts` — `team_member_added` on submit
- `src/app/pages/settings/components/account-settings/account-settings.component.ts` — `account_settings_saved` on save
- `src/app/pages/settings/components/security-settings/security-settings.component.ts` — `two_factor_auth_toggled` and `session_revoked`
- `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` — `notification_preferences_saved`
- `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` — `quick_action_clicked`
- `src/app/pages/users/list/list.component.ts` — `user_list_item_clicked`

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; also calls `posthog.identify()` | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Fired when a user logs out; also calls `posthog.reset()` | `src/app/auth/logout/logout.component.ts` |
| `plan_upgraded` | Fired when a user selects a new billing plan (plan_id, plan_name, plan_price, previous_plan) | `src/app/pages/billing/billing.component.ts` |
| `project_created` | Fired when a new project is created (project_name, project_status) | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a team member is added (member_role) | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | Fired when account settings are saved (changed_password) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when 2FA is enabled or disabled (enabled) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a session is revoked (revoke_all) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fired when notification preferences are saved (productUpdates, weeklyDigest, teamActivity, desktop, sound) | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `quick_action_clicked` | Fired when a quick action is clicked on the dashboard (action_id, action_label) | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_list_item_clicked` | Fired when a user clicks on an item in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Login trend** — Trends chart for `user_logged_in` (daily unique users logging in)
2. **Plan upgrade funnel** — Funnel from `user_logged_in` → `plan_upgraded` (conversion to paid)
3. **Project creation trend** — Trends chart for `project_created` (new projects over time)
4. **Team growth** — Trends chart for `team_member_added` (new members by role)
5. **Churn signal** — Trends chart comparing `user_logged_in` vs `user_logged_out` (retention signal)

Create your dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
