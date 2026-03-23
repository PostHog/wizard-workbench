<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here is a summary of all changes made:

- **Installed** `posthog-js` as a project dependency
- **Created** `src/app/@core/services/posthog.service.ts` — a singleton Angular service wrapping the PostHog SDK with SSR safety (no-op proxy when not in browser) and `NgZone.runOutsideAngular` initialization to avoid performance issues with session recording
- **Created** `src/env.d.ts` — TypeScript type declarations for `import.meta.env` to support Angular CLI's NG_APP_ environment variable injection
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` to include `posthogKey` and `posthogHost` fields, reading from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` environment variables
- **Configured** `.env` with the PostHog project token and host (`.gitignore`-protected)
- **Updated** `src/app/app.component.ts` to inject `PosthogService` and initialize PostHog on startup with `capture_exceptions: true` for automatic error tracking
- **Added** PostHog user identification in `login.component.ts` — identifies users by their unique ID with email, username, and full name on successful login
- **Added** PostHog reset in `logout.component.ts` — captures logout event and resets the PostHog session on logout
- **Added** event tracking across 8 component files covering login, logout, billing, team management, project creation, account settings, security settings, and user interactions

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in (with user identification) | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user successfully logs out (with PostHog reset) | `src/app/auth/logout/logout.component.ts` |
| `plan_selected` | Fired when a user selects a billing plan | `src/app/pages/billing/billing.component.ts` |
| `member_added` | Fired when a new team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `project_created` | Fired when a new project is created | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `account_deleted` | Fired when a user clicks to delete their account | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | Fired when a user enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_profile_viewed` | Fired when a user is clicked in the users list | `src/app/pages/users/list/list.component.ts` |
| `$exception` | Automatic error capture on login failures | `src/app/auth/login/login.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics Dashboard](https://us.posthog.com/project/238460/dashboard/1262598)
- [User Auth Trend](https://us.posthog.com/project/238460/insights/od6OtOUD) — Daily logins and logouts over 30 days
- [Team & Project Actions](https://us.posthog.com/project/238460/insights/fXz2ZCBS) — Project creation and member additions
- [Settings & Security Activity](https://us.posthog.com/project/238460/insights/ypLalI4y) — Account settings, 2FA toggles, and session revocations
- [Billing Page Funnel](https://us.posthog.com/project/238460/insights/9QeEIAN7) — Top of the upgrade funnel

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
