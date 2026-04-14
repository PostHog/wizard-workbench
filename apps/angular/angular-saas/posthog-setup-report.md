<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here is a summary of all changes made:

- **`posthog-js` installed** as a new dependency.
- **`src/env.d.ts`** created to type-declare `import.meta.env` for Angular CLI's `NG_APP_*` environment variable support.
- **`src/environments/environment.ts`** and **`src/environments/environment.prod.ts`** updated to expose `posthogKey` and `posthogHost` from environment variables.
- **`.env`** updated with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`.
- **`src/app/@core/services/posthog.service.ts`** created as a singleton root service wrapping posthog-js with SSR safety (no-op proxy when not in browser).
- **`src/app/app.component.ts`** updated to initialize PostHog on application startup.
- **10 event capture calls** added across 8 component files.
- **User identification** (`posthog.identify`) added on login with username and email.
- **Session reset** (`posthog.reset`) added on logout.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is successfully created | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a new team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | Fired when a user selects or changes their billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when account settings are saved | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_settings_saved` | Fired when notification preferences are saved | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_toggled` | Fired when 2FA is enabled or disabled | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've set up the analytics events — here are the recommended insights to build your "Analytics basics" dashboard in PostHog:

- **[Daily Logins](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_logged_in","type":"events"}],"date_from":"-30d"})** — trend of `user_logged_in` over the last 30 days.
- **[Project Creation Rate](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"project_created","type":"events"}],"date_from":"-30d"})** — how often new projects are being created.
- **[Plan Upgrades](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"plan_selected","type":"events"}],"breakdown":"plan_name","breakdown_type":"event","date_from":"-30d"})** — `plan_selected` broken down by `plan_name` to track upgrade/downgrade patterns.
- **[Login → Project Created Funnel](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_logged_in","type":"events"},{"id":"project_created","type":"events"}],"display":"FunnelViz","date_from":"-30d"})** — conversion funnel from login to first project creation.
- **[Churn Signal: Logouts](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_logged_out","type":"events"}],"date_from":"-30d"})** — trend of `user_logged_out` as an early churn indicator.

Create the "Analytics basics" dashboard: **[https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
