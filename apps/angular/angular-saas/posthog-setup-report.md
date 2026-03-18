<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. Here's a summary of what was done:

- **Installed** `posthog-js` npm package
- **Created** `PostHogService` (`src/app/@core/services/posthog.service.ts`) — a singleton root service that wraps the PostHog SDK with SSR safety and browser-only initialization
- **Configured** environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`) via `.env` file and wired them into `src/environments/environment.ts` and `src/environments/environment.prod.ts`
- **Initialized** PostHog in `app.component.ts` with `capture_exceptions: true` for automatic error tracking
- **Added** user identification (`posthog.identify()`) on login and `posthog.reset()` on logout
- **Instrumented** 10 events across 8 files covering login, logout, billing, profile, settings, project creation, member management, and dashboard actions

## Events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user successfully logs out | `src/app/auth/logout/logout.component.ts` |
| `billing_plan_viewed` | Fired when a user views the billing page (top of conversion funnel) | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes a session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

Visit your PostHog project to create an "Analytics basics" dashboard with these recommended insights:

- **Login funnel**: `user_logged_in` → `billing_plan_viewed` to track conversion from login to billing
- **Project creation rate**: Trend of `project_created` events over time
- **Team growth**: Trend of `member_added` events grouped by `role`
- **Security adoption**: `two_factor_toggled` grouped by `enabled` property
- **Quick action engagement**: `quick_action_clicked` grouped by `action_label`

[Open PostHog Project](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
