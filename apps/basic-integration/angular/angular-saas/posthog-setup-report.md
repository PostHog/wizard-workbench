<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular 21 SaaS application. The following changes were made:

- **`src/app/services/posthog.service.ts`** — New singleton service wrapping posthog-js with SSR safety (no-op proxy when running server-side via `isPlatformBrowser` checks)
- **`src/app/app.component.ts`** — PostHog initialized in `ngOnInit` using credentials from the environment file
- **`src/environments/environment.ts`** and **`src/environments/environment.prod.ts`** — Added `posthogKey` and `posthogHost` fields reading from `NG_APP_*` environment variables via `import.meta.env`
- **`src/env.d.ts`** — New TypeScript type declaration for `import.meta.env` (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`)
- **`.env`** — Created with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` values
- **`src/app/auth/services/authentication.service.ts`** — `posthog.identify()` and `user_logged_in` captured on successful login
- **`src/app/auth/logout/logout.component.ts`** — `user_logged_out` captured and `posthog.reset()` called on logout
- **`src/app/shared/components/create-project-modal/create-project-modal.component.ts`** — `project_created` captured on project creation
- **`src/app/shared/components/add-member-modal/add-member-modal.component.ts`** — `team_member_added` captured on member invitation
- **`src/app/pages/billing/billing.component.ts`** — `billing_plan_viewed` captured on component init (top of upgrade funnel)
- **`src/app/pages/profile/profile.component.ts`** — `profile_updated` captured on successful profile save
- **`src/app/pages/settings/components/account-settings/account-settings.component.ts`** — `account_settings_saved` captured on save
- **`src/app/pages/settings/components/security-settings/security-settings.component.ts`** — `two_factor_authentication_toggled` and `session_revoked` captured

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logged in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logged out and session ended | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_viewed` | User viewed the billing/pricing page | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saved changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saved changes in account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_authentication_toggled` | User enabled or disabled 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with insights for:

1. **Login trend** — `user_logged_in` over time (user acquisition/retention signal)
2. **Project creation funnel** — `user_logged_in` → `project_created` (onboarding conversion)
3. **Billing page views** — `billing_plan_viewed` over time (upgrade intent)
4. **Team growth** — `team_member_added` over time (expansion signal)
5. **Security engagement** — `two_factor_authentication_toggled` breakdown by `enabled` property

Visit [PostHog Dashboards](/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
