<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here's a summary of all changes made:

**New files created:**
- `src/app/services/posthog.service.ts` — Singleton root service wrapping posthog-js with SSR safety, NgZone integration, and lazy initialization.

**Environment setup:**
- `.env` — Created with `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` (already in `.gitignore`).
- `src/environments/environment.ts` — Added `posthogKey` and `posthogHost` fields read from `import.meta.env`.
- `src/environments/environment.prod.ts` — Same additions for production builds.

**PostHog initialization:**
- `src/app/app.component.ts` — PosthogService injected and initialized in `ngOnInit` with `capture_exceptions: true` and the `defaults: '2026-01-30'` flag for automatic pageview tracking.

**User identification:**
- `src/app/auth/login/login.component.ts` — `posthog.identify()` called on successful login with user ID, username, email, and name properties. Login errors captured as `$exception` events.
- `src/app/auth/logout/logout.component.ts` — `posthog.reset()` called after logout to unlink future events from the user session.

**Events instrumented:**

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created via the modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_invited` | Fired when a new team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `billing_viewed` | Fired when a user views the billing/plans page — top of conversion funnel | `src/app/pages/billing/billing.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action button on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

### Creating your "Analytics basics" dashboard

To create the recommended dashboard, go to [Dashboards](/dashboards) in PostHog and create a new dashboard named "Analytics basics". Add the following insights:

1. **Login trend** — Trends chart for `user_logged_in` over time, to track daily active users signing in.
2. **Billing page conversion funnel** — Funnel from `billing_viewed` → `project_created`, to measure how many users who view billing go on to create a project.
3. **Project creation trend** — Trends chart for `project_created` over time, broken down by `project_status`.
4. **Team growth** — Trends chart for `member_invited` over time, broken down by `member_role`.
5. **Security engagement** — Trends chart comparing `two_factor_auth_toggled` and `session_revoked` to understand security feature usage.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
