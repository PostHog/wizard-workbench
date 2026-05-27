<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The integration includes the `posthog-js` SDK, a root-level PostHog service with SSR-safe initialization, user identification on login, identity reset on logout, and event capture across all key user flows including project creation, team member additions, billing page visits, profile updates, and security setting changes.

## Integration summary

- **PostHog service** (`src/app/services/posthog.service.ts`): Singleton Angular service wrapping `posthog-js` with browser-safety checks via `isPlatformBrowser`.
- **App initialization** (`src/app/app.component.ts`): PostHog initialized in `ngOnInit` with the project token and host from environment variables. Exception capture enabled.
- **Environment files** (`src/environments/environment.ts`, `src/environments/environment.prod.ts`): Added `posthogKey` and `posthogHost` fields reading from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` environment variables.
- **Type declarations** (`src/env.d.ts`): Added `ImportMeta.env` type declarations for the `NG_APP_*` environment variables.
- **User identification** (`src/app/auth/login/login.component.ts`): Calls `posthog.identify()` with username, email, first name, and last name on successful login.
- **Logout reset** (`src/app/auth/logout/logout.component.ts`): Calls `posthog.capture('user_logged_out')` and `posthog.reset()` before clearing credentials.

## Events

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and logged in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User explicitly logged out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User created a new project via the create project modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User added a new team member to the project | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saved changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `billing_page_viewed` | User viewed the billing page — top of the upgrade conversion funnel | `src/app/pages/billing/billing.component.ts` |
| `two_factor_auth_toggled` | User enabled or disabled two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active device session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `create_project_modal_opened` | User opened the create project modal from the dashboard | `src/app/pages/dashboard/dashboard.component.ts` |
| `add_member_modal_opened` | User opened the add member modal from the dashboard | `src/app/pages/dashboard/dashboard.component.ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with the following suggested insights:

- **User login trend** — Trends chart for `user_logged_in` over time to monitor daily active users
- **Project creation funnel** — Funnel from `create_project_modal_opened` → `project_created` to measure conversion
- **Team growth** — Trends chart for `member_added` over time to track team expansion
- **Billing engagement** — Trends chart for `billing_page_viewed` to monitor upgrade interest
- **Security actions** — Trends chart for `two_factor_auth_toggled` (filtered to `enabled = true`) to measure 2FA adoption

Create your dashboard at: [/dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
