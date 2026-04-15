<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The following changes were made:

- **Installed** `posthog-js` package
- **Created** `PosthogService` (`src/app/shared/services/posthog.service.ts`) — an SSR-safe singleton root service wrapping the PostHog SDK
- **Initialized** PostHog in `AppComponent.ngOnInit()` using `environment.posthogKey` and `environment.posthogHost`
- **Added environment variables** `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `src/environments/.env.ts`, `environment.ts`, and `environment.prod.ts`
- **Identified users** on login via `posthog.identify()` with user ID, username, email, and name
- **Reset identity** on logout via `posthog.reset()`
- **Instrumented 10 events** across 8 component files

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out (PostHog identity reset) | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects or changes their billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `account_deleted` | Fired when a user clicks the delete account button | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with the following suggested insights:

- [New dashboard](https://us.posthog.com/project/2/dashboard/new) — Create an "Analytics basics" dashboard with these insights:
  1. **Login funnel** — Conversion funnel from `user_logged_in` → `project_created` (user activation)
  2. **Billing plan distribution** — Breakdown of `billing_plan_selected` by `plan_name` property
  3. **Active users** — Trend of `user_logged_in` events over time (DAU/WAU)
  4. **Project creation rate** — Trend of `project_created` events over time
  5. **Churn indicator** — Trend of `user_logged_out` vs `user_logged_in` events (engagement health)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
