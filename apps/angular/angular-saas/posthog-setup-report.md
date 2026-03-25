<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular 21 SaaS application. Here's a summary of the changes made:

## Integration Summary

### New files created
- **`src/app/@core/services/posthog.service.ts`** — A singleton `PosthogService` that wraps the PostHog JS SDK. Initializes PostHog outside Angular's zone (for optimal session recording performance) and provides an SSR-safe proxy getter.
- **`src/env.d.ts`** — TypeScript type declarations for `import.meta.env` to support `NG_APP_`-prefixed environment variables.
- **`.env`** — PostHog credentials set via environment variables (gitignored).

### Modified files
- **`src/environments/environment.ts`** — Added `posthogKey` and `posthogHost` fields, reading from `import.meta.env['NG_APP_POSTHOG_KEY']` and `import.meta.env['NG_APP_POSTHOG_HOST']`.
- **`src/environments/environment.prod.ts`** — Same as above for production.
- **`src/app/app.component.ts`** — Injects `PosthogService` at app root to ensure early initialization.

### Event tracking added

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Includes `posthog.identify()` call with user ID and email. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out. Also calls `posthog.reset()` to clear the user session. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created. Includes project name, status, and whether a description was provided. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added. Includes the member's role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | Fired when account settings are saved. Includes whether the password was changed. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when 2FA is enabled or disabled. Includes the new enabled state. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when one or all other sessions are revoked. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a quick action button is clicked on the dashboard. Includes action ID and label. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_profile_clicked` | Fired when a user profile is clicked in the user list. | `src/app/pages/users/list/list.component.ts` |
| `billing_plan_viewed` | Fired on init of the billing page. Includes current plan and available plans. | `src/app/pages/billing/billing.component.ts` |

### Error tracking added
- Login errors are captured as `$exception` events with error message and type in `login.component.ts`.
- PostHog's built-in `capture_exceptions: true` config option is set in the service for automatic exception capture.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/238460/dashboard/1400101
- **User Login Trend**: https://us.posthog.com/project/238460/insights/zvjmMH8u
- **Project Creation Funnel**: https://us.posthog.com/project/238460/insights/lDnG7lh5
- **Member Roles Distribution**: https://us.posthog.com/project/238460/insights/0xOXw18Z
- **Quick Actions Usage**: https://us.posthog.com/project/238460/insights/2A2rBVVe
- **Security Events**: https://us.posthog.com/project/238460/insights/aZlB7Rpd

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
