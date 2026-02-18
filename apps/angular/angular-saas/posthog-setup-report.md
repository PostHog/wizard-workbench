<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular 21 SaaS boilerplate. Here's what was done:

- **Installed** the `posthog-js` package via npm.
- **Created** `src/app/@core/services/posthog.service.ts` — a singleton Angular service that initialises PostHog outside Angular's zone (to avoid change detection performance issues with session replay), and provides an SSR-safe proxy for server-side rendering safety.
- **Configured** `src/environments/environment.ts` and `src/environments/environment.prod.ts` to include `posthogKey` and `posthogHost`, read from the project's `.env.ts` file.
- **Set** `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST` in `.env` via the wizard-tools MCP server (never hardcoded in source).
- **Injected** `PosthogService` into `AppComponent` to ensure PostHog initialises at app startup.
- **Added** `user identify` calls on login so that events are attributed to real users.
- **Added** `posthog.reset()` on logout to clear the user identity.
- **Added** `$exception` capture to the `ErrorHandlerInterceptor` so all HTTP errors are sent to PostHog error tracking.
- **Added** `capture_exceptions: true` to the PostHog init config to enable automatic error tracking.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in (with `identify` call) | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out (with `posthog.reset()`) | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created via the modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added via the modal | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects/upgrades a billing plan | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings are saved | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when the user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session (individual or all) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action button on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_clicked` | Fired when a user row is clicked in the users list | `src/app/pages/users/list/list.component.ts` |
| `$exception` (HTTP errors) | Fired on intercepted HTTP errors with status code and URL | `src/app/@core/interceptors/error-handler.interceptor.ts` |
| `$exception` (login errors) | Fired when login fails | `src/app/auth/login/login.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1262598)** — overview of all key events

**Insights on the dashboard:**
- 📈 **[User Auth Trend](https://us.posthog.com/project/238460/insights/od6OtOUD)** — daily logins and logouts over 30 days
- 🏗️ **[Team & Project Actions](https://us.posthog.com/project/238460/insights/fXz2ZCBS)** — project creation and member additions
- ⚡ **[Quick Actions Usage](https://us.posthog.com/project/238460/insights/nepFSPxN)** — which quick actions users click most (breakdown by action)
- ⚙️ **[Settings & Security Activity](https://us.posthog.com/project/238460/insights/ypLalI4y)** — account settings saves, 2FA toggles, and session revocations
- 💳 **[Billing Page Funnel](https://us.posthog.com/project/238460/insights/9QeEIAN7)** — billing page engagement at the top of the upgrade funnel

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
