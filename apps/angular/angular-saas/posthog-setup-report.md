<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular boilerplate project. Here's a summary of what was done:

- **Installed** `posthog-js` via npm
- **Created** a singleton `PosthogService` (`src/app/@core/services/posthog.service.ts`) with SSR-safe proxy pattern using `inject(PLATFORM_ID)` and `isPlatformBrowser()`
- **Initialized** PostHog in `AppComponent.ngOnInit()` using environment variables for the API key and host
- **Added** `posthogKey` and `posthogHost` to both `environment.ts` and `environment.prod.ts` via `import.meta.env` (compatible with Angular's Vite-based builder)
- **Stored** PostHog credentials in `.env` (gitignored) using `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST`
- **Tracked 12 events** across 8 files with user identification, conversion funnel events, and error tracking
- **Added user identification** on login using `posthog.identify()` with user ID and profile properties
- **Added session reset** on logout using `posthog.reset()`
- **Added error tracking** via `$exception` captures in the HTTP error interceptor and login error handler

## Events Tracked

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; also calls `identify()` | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user successfully logs out; also calls `reset()` | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created via the modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a new team member is added via the modal | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `quick_action_clicked` | Fired when a quick action button is clicked on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `billing_plan_viewed` | Fired when the billing page is viewed (top of conversion funnel) | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when the user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_list_loaded` | Fired when the users list is successfully loaded | `src/app/pages/users/list/list.component.ts` |
| `user_clicked` | Fired when a user row is clicked in the users list | `src/app/pages/users/list/list.component.ts` |
| `http_error` | Fired on HTTP errors caught by the global interceptor | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following 5 insights to monitor user behavior:

1. **Login & Logout Trend** — Trends chart tracking `user_logged_in` and `user_logged_out` over the last 30 days
2. **Login to Project Creation Funnel** — Funnel from `user_logged_in` → `project_created` to measure user activation
3. **Team Growth** — Trends chart tracking `member_added` to monitor team expansion
4. **Billing Page Views** — Trends chart tracking `billing_plan_viewed` as the top of the paid conversion funnel
5. **HTTP Errors** — Trends chart tracking `http_error` for application health monitoring

To create this dashboard, log into PostHog at https://us.posthog.com, navigate to **Dashboards** → **New dashboard**, name it "Analytics basics", and add the insights above using the event names listed in the table.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
