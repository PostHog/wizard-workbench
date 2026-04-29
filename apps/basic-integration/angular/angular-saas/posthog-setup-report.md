<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here is a summary of everything that was set up:

**New files created:**
- `src/app/@core/services/posthog.service.ts` — Singleton `PostHogService` that wraps posthog-js with SSR safety via `isPlatformBrowser`. All components inject this service to call `posthog.capture()`, `posthog.identify()`, and `posthog.reset()`.

**Files modified:**
- `src/environments/.env.ts` — Added `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` keys.
- `src/environments/environment.ts` — Added `posthogKey` and `posthogHost` fields read from `env`.
- `src/environments/environment.prod.ts` — Same additions for production.
- `src/app/@core/services/index.ts` — Exported `PostHogService`.
- `src/app/app.component.ts` — Injects `PostHogService` and calls `posthogService.init()` in `ngOnInit` with `capture_exceptions: true`.
- `src/app/auth/login/login.component.ts` — Calls `posthog.identify()` and captures `user_logged_in` on successful login.
- `src/app/auth/logout/logout.component.ts` — Captures `user_logged_out` and calls `posthog.reset()` on logout.
- `src/app/shared/components/create-project-modal/create-project-modal.component.ts` — Captures `project_created`.
- `src/app/shared/components/add-member-modal/add-member-modal.component.ts` — Captures `team_member_added`.
- `src/app/pages/profile/profile.component.ts` — Captures `profile_updated`.
- `src/app/pages/settings/components/account-settings/account-settings.component.ts` — Captures `account_settings_saved`.
- `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` — Captures `notification_preferences_saved`.
- `src/app/pages/settings/components/security-settings/security-settings.component.ts` — Captures `two_factor_auth_toggled` and `session_revoked`.
- `src/app/pages/billing/billing.component.ts` + `billing.component.html` — Captures `plan_upgrade_clicked` when a user clicks Upgrade.
- `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` — Captures `quick_action_clicked`.
- `src/app/pages/users/list/list.component.ts` — Captures `user_list_item_clicked`.

**Environment variables set** (in `.env`, gitignored):
- `NG_APP_POSTHOG_PROJECT_TOKEN`
- `NG_APP_POSTHOG_HOST`

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logged out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saved changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saved account settings (profile info or password change) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saved notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | User enabled or disabled two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `plan_upgrade_clicked` | User clicked the Upgrade button on a billing plan | `src/app/pages/billing/billing.component.ts` |
| `quick_action_clicked` | User clicked a quick action button on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_list_item_clicked` | User clicked on a user in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've suggested an "Analytics basics" dashboard with five key insights for your project. Create it in PostHog using the links below:

- **Dashboard**: [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)
- **Insight 1 — Login funnel** (conversion from `user_logged_in` → `project_created`): [New funnel insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)
- **Insight 2 — Daily active users** (trend of `user_logged_in` over time): [New trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)
- **Insight 3 — Plan upgrade clicks by plan** (breakdown of `plan_upgrade_clicked` by `plan_name`): [New trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)
- **Insight 4 — Team growth** (trend of `team_member_added` over time): [New trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)
- **Insight 5 — User churn signal** (`user_logged_out` count and trend): [New trend insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
