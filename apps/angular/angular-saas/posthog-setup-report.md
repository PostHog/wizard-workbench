# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. Here is a summary of all changes made:

- **Installed** `posthog-js` as a production dependency
- **Created** a `PosthogService` singleton (`src/app/shared/services/posthog.service.ts`) that wraps the posthog-js SDK with SSR-safety using `isPlatformBrowser()` and a no-op Proxy for server-side rendering
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` to read `posthogKey` and `posthogHost` from `import.meta.env` (via `.env` file variables `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST`)
- **Initialized** PostHog in `AppComponent.ngOnInit()` with `capture_exceptions: true` for automatic error tracking
- **Added user identification** in `AuthenticationService`: calls `posthog.identify()` with user ID and properties on login, and `posthog.reset()` on logout
- **Added `posthog.capture()` calls** to 10 components covering the most business-critical user actions

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User explicitly logged out | `src/app/auth/services/authentication.service.ts` |
| `plan_selected` | User selected a billing plan | `src/app/pages/billing/billing.component.ts` |
| `invoice_downloaded` | User downloaded an invoice | `src/app/pages/billing/billing.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | User saved account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User updated notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | User enabled or disabled two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `profile_updated` | User updated their profile information | `src/app/pages/profile/profile.component.ts` |
| `user_clicked` | User clicked on a user entry in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **[Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)** — overview of core metrics
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — tracks users through pricing → checkout
  - [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — daily signups and sign-ins
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — checkout completions and subscription changes
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI) — member invitations and removals
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — account deletion trends

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
