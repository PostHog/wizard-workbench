<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application.

## Summary of changes

- **`src/app/@core/services/posthog.service.ts`** *(new)* — Singleton `PosthogService` wrapping `posthog-js`. Browser-safe via `isPlatformBrowser()` check; returns a no-op proxy on server to prevent SSR errors.
- **`src/app/app.component.ts`** — Injects `PosthogService` and calls `init()` in `ngOnInit()` using credentials from `environment`.
- **`src/environments/environment.ts`** — Added `posthogKey` and `posthogHost` fields, reading from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` env vars via `import.meta.env`.
- **`src/environments/environment.prod.ts`** — Same as above for the production environment.
- **`src/env.d.ts`** *(new)* — TypeScript declaration for `ImportMeta.env` to support `import.meta.env` in Angular 17+ esbuild builder.
- **`.env`** *(new)* — Environment file with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` (gitignored).
- **`src/app/auth/login/login.component.ts`** — Identifies user with `posthog.identify()` on successful login; captures `user_logged_in`.
- **`src/app/auth/logout/logout.component.ts`** — Captures `user_logged_out` and calls `posthog.reset()` on logout.
- **`src/app/shared/components/create-project-modal/create-project-modal.component.ts`** — Captures `project_created` with project name, status, and whether a description was provided.
- **`src/app/shared/components/add-member-modal/add-member-modal.component.ts`** — Captures `team_member_added` with the assigned role.
- **`src/app/pages/settings/components/account-settings/account-settings.component.ts`** — Captures `account_settings_saved` (with password change flag) and `account_deletion_initiated`.
- **`src/app/pages/settings/components/notification-settings/notification-settings.component.ts`** — Captures `notification_preferences_saved` with all preference values.
- **`src/app/pages/settings/components/security-settings/security-settings.component.ts`** — Captures `two_factor_auth_toggled` and `session_revoked`.
- **`src/app/pages/billing/billing.component.ts`** — Captures `billing_page_viewed` on init (top of upgrade funnel).
- **`src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts`** — Captures `quick_action_clicked` with action id and label.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | New project created via modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | New team member added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `account_deletion_initiated` | User clicks Delete Account (churn signal) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | 2FA enabled or disabled | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `billing_page_viewed` | User views billing page (top of upgrade funnel) | `src/app/pages/billing/billing.component.ts` |
| `quick_action_clicked` | User clicks a dashboard quick action | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

Visit your PostHog project to start exploring these events. Suggested insights to build in PostHog:

- **Login funnel** — Track `user_logged_in` over time; segment by new vs returning users.
- **Engagement** — Trend of `project_created` and `team_member_added` to measure activation depth.
- **Upgrade funnel** — Users who hit `billing_page_viewed` but never trigger a plan change.
- **Churn signal** — Count of `account_deletion_initiated` events over time.
- **Security adoption** — Rate of `two_factor_auth_toggled` with `enabled: true` vs `false`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
