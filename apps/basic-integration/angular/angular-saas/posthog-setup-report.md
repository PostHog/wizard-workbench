<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular 21 SaaS application. A new singleton `PosthogService` was created to initialize the PostHog SDK outside of Angular's change detection (using `NgZone.runOutsideAngular`) for optimal performance with session replay. PostHog is initialized on app startup via `AppComponent`, and user identification is performed immediately after login using `posthog.identify()` with the user's ID and profile properties. On logout, `posthog.reset()` is called to clear the anonymous/identified user session. Error tracking (`capture_exceptions: true`) is also enabled globally.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `login_failed` | Fired when a login attempt fails | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user successfully logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project (includes name, status, has_description) | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user adds a new team member (includes role) | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_upgrade_clicked` | Fired when a user clicks to upgrade a billing plan (includes plan name, price, current plan) | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings (includes whether password was changed) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves notification preferences (includes all toggle states) | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when 2FA is enabled or disabled (includes new state) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a session is revoked (single or all) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `profile_updated` | Fired when a user saves profile changes | `src/app/pages/profile/profile.component.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- [New dashboard →](https://us.posthog.com/project/2/dashboard)

Suggested insights to add to the dashboard:

1. **Login funnel** — Funnel from `user_logged_in` → `project_created` to measure onboarding conversion
   [Create insight →](https://us.posthog.com/project/2/insights/new)

2. **Daily active users (login trend)** — Trend of `user_logged_in` unique users over time, to track engagement
   [Create insight →](https://us.posthog.com/project/2/insights/new)

3. **Billing upgrade interest** — Trend of `billing_plan_upgrade_clicked` to measure monetization intent, broken down by `plan_name`
   [Create insight →](https://us.posthog.com/project/2/insights/new)

4. **Project creation rate** — Trend of `project_created` unique users over time, to measure product adoption
   [Create insight →](https://us.posthog.com/project/2/insights/new)

5. **Churn signal: logout rate** — Trend of `user_logged_out` vs `user_logged_in` as a ratio to spot churn signals
   [Create insight →](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
