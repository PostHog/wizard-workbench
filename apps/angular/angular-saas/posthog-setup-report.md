<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular 21 SaaS application. Here's a summary of all changes made:

## What was set up

- **`posthog-js` installed** via npm as a project dependency
- **Environment variables** configured in `.env` (`NG_APP_POSTHOG_KEY`, `NG_APP_POSTHOG_HOST`) and surfaced through `src/environments/environment.ts` and `src/environments/environment.prod.ts`
- **`PosthogService`** created at `src/app/@core/services/posthog.service.ts` — a singleton root service that wraps the PostHog SDK, runs initialization outside Angular's zone (for performance), and provides an SSR-safe no-op proxy
- **PostHog initialized** in `AppComponent.ngOnInit()` so it fires before any user interactions
- **User identification** added on login via `posthog.identify()` with user ID and traits (username, email, name)
- **PostHog reset** called on logout to clear the user identity
- **Error tracking** added to the HTTP error interceptor via `$exception` events

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on successful login; identifies the user in PostHog | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Fired on logout; resets PostHog identity | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a project is successfully created via the modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added; includes their role | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects a billing plan; includes plan id, name, price, and previous plan | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile form | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings are saved; includes whether a password change was requested | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when 2FA is enabled or disabled; includes the new enabled state | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a session is revoked (single or bulk); includes device name and count | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_clicked` | Fired when a user row is clicked in the users list | `src/app/pages/users/list/list.component.ts` |
| `$exception` | Fired on HTTP errors caught by the error interceptor; includes status code and URL | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1262598)
  - [User Auth Trend](https://us.posthog.com/project/238460/insights/od6OtOUD) — Daily logins and logouts over 30 days
  - [Team & Project Actions](https://us.posthog.com/project/238460/insights/fXz2ZCBS) — Project creation and member additions
  - [Billing Page Funnel](https://us.posthog.com/project/238460/insights/9QeEIAN7) — Top of the upgrade funnel
  - [Settings & Security Activity](https://us.posthog.com/project/238460/insights/ypLalI4y) — Account settings saves, 2FA toggles, session revocations
  - [Quick Actions Usage](https://us.posthog.com/project/238460/insights/nepFSPxN) — Quick action button engagement

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
