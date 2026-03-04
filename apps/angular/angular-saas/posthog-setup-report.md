<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The following changes were made:

1. **Installed `posthog-js`** – added to project dependencies via npm.
2. **Created `PostHogService`** (`src/app/shared/services/posthog.service.ts`) – a singleton Angular service that wraps the PostHog SDK with SSR safety using `isPlatformBrowser()`.
3. **Updated environment files** – added `posthogKey` and `posthogHost` fields to `src/environments/environment.ts` and `src/environments/environment.prod.ts`, reading values from `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST` environment variables.
4. **Set up `.env` file** – `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST` configured for the project (`.env` is in `.gitignore`).
5. **Initialized PostHog in `AppComponent`** (`src/app/app.component.ts`) – PostHog is initialized on app start with exception capture enabled.
6. **Instrumented 10 events** across 8 files, including user identification on login and identity reset on logout.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out of the app | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | User selects a billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `quick_action_clicked` | User clicks a quick action button on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've defined the following insights for an **"Analytics basics"** dashboard. You can create these in your [PostHog project](https://us.i.posthog.com/project/2):

1. **User Authentication Trends** — Trend of `user_logged_in` vs `user_logged_out` over the last 30 days to track daily active sessions.
2. **Login → Project Creation Funnel** — Conversion funnel tracking `user_logged_in` → `project_created` to measure how many users create projects after logging in.
3. **Billing Plan Upgrades** — Trend of `plan_selected` events broken down by `plan_name` property to track upgrade conversions.
4. **Team Growth** — Trend of `team_member_added` events over time, indicating product virality and expansion revenue potential.
5. **Settings Engagement** — Trend of `account_settings_saved`, `notification_preferences_saved`, and `two_factor_auth_toggled` to measure user configuration activity.

To set up the dashboard:
1. Go to [PostHog Dashboards](https://us.i.posthog.com/project/2/dashboards)
2. Create a new dashboard named "Analytics basics"
3. Add the 5 insights listed above using the event names from the table

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
