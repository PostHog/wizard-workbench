# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. Here is a summary of all changes made:

**Package installed:** `posthog-js` was added as a dependency.

**Environment configuration:** PostHog credentials are loaded from environment variables (`NG_APP_POSTHOG_KEY`, `NG_APP_POSTHOG_HOST`) via the project's `.env` file. Both `src/environments/environment.ts` and `src/environments/environment.prod.ts` were updated to expose `posthogKey` and `posthogHost`.

**PosthogService created:** A new singleton root service (`src/app/@core/services/posthog.service.ts`) wraps the PostHog SDK with SSR safety (using `isPlatformBrowser`), runs initialization outside Angular's zone for performance, and exposes a no-op proxy when running server-side.

**App initialization:** `PosthogService.init()` is called in `AppComponent.ngOnInit()` to bootstrap PostHog on app load with automatic pageview tracking (`defaults: '2026-01-30'`) and exception capture (`capture_exceptions: true`).

**User identification:** On successful login, `posthog.identify()` is called with the user's ID and properties (username, email). On logout, `posthog.capture('user_logged_out')` is followed by `posthog.reset()` to unlink sessions.

**Event instrumentation:** 11 custom events were added across the application to track key user actions.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project, includes project name and status | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a team member is added to the team, includes role | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA, includes enabled status | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `user_clicked` | Fired when a user row is clicked in the users list | `src/app/pages/users/list/list.component.ts` |
| `http_error_occurred` | Fired when an HTTP request fails, includes error details | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/2/dashboard/1344803
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — Funnel tracking pricing page views → checkout started → checkout completed
  - [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — Daily signups and sign-ins over 30 days
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — Checkout completions and subscription changes over time
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI) — Team member invitations and removals over time
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — Account deletions as a leading churn indicator

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
