<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. Here's a summary of everything that was added:

**SDK & Service**: `posthog-js` was installed and a singleton `PostHogService` was created at `src/app/@core/services/posthog.service.ts`. It wraps the PostHog SDK with SSR safety via `isPlatformBrowser()` and a no-op proxy pattern — safe for server-side rendering contexts.

**Initialization**: PostHog is initialized in the root `AppComponent.ngOnInit()` using environment variables (`posthogKey`, `posthogHost`) read from `.env` via Angular's `import.meta.env` support. Exception capture is enabled by default.

**User identification**: On every login, `posthog.identify()` is called with the user's ID and profile properties (username, email, first/last name) to associate all future events with that person. On logout, `posthog.reset()` clears the identity.

**Events tracked**:

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out; calls `posthog.reset()` | `src/app/auth/logout/logout.component.ts` |
| `project_created` | New project created via modal (with name, status, has_description) | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Team member added via modal (with role) | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_viewed` | Billing page loaded — top of the upgrade funnel (with current_plan) | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves profile form changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Account settings saved (with password_changed flag) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `tfa_toggled` | 2FA enabled or disabled (with tfa_enabled state) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Active session revoked (with device, revoke_all) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_list_item_clicked` | User clicked a row in the users list | `src/app/pages/users/list/list.component.ts` |

**Environment**: `.env` was created with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`. These are read at build time via Angular 21's native `import.meta.env` support and injected into `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

## Next steps

We've linked to an existing dashboard with insights tracking user behavior based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/238460/dashboard/1262598)
  - [User Auth Trend](https://us.posthog.com/project/238460/insights/od6OtOUD) — daily logins and logouts over 30 days
  - [Team & Project Actions](https://us.posthog.com/project/238460/insights/fXz2ZCBS) — projects created vs members added
  - [Settings & Security Activity](https://us.posthog.com/project/238460/insights/ypLalI4y) — account settings saves and 2FA changes
  - [Billing Page Funnel](https://us.posthog.com/project/238460/insights/9QeEIAN7) — users reaching the billing/upgrade page
  - [Quick Actions Usage](https://us.posthog.com/project/238460/insights/nepFSPxN) — breakdown of quick action clicks

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
