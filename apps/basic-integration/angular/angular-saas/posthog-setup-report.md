<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A `PosthogService` singleton was created to wrap the PostHog SDK with SSR-safety guards, and PostHog is initialized in the root `AppComponent`. User identification happens on login via `posthog.identify()`, and `posthog.reset()` is called on logout. Ten events covering the core user journey — from login through project creation, team management, settings, and billing — are now tracked across the application.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with their credentials. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user completes the logout flow and credentials are cleared. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user successfully submits the create project form. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user successfully adds a new team member. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings including profile info or password. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from their account. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks to upgrade or change their subscription plan. | `src/app/pages/billing/billing.component.ts` |
| `dashboard_viewed` | Fired when a user views the dashboard — top of the core product funnel. | `src/app/pages/dashboard/dashboard.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1777423)
  - [Login Funnel](https://us.i.posthog.com/project/483112/insights/9685403) — `user_logged_in` → `dashboard_viewed` → `project_created`
  - [Unique Users Logging In Over Time](https://us.i.posthog.com/project/483112/insights/9685404)
  - [Project Creation Trend](https://us.i.posthog.com/project/483112/insights/9685405)
  - [Plan Upgrade Clicks Trend](https://us.i.posthog.com/project/483112/insights/9685407)
  - [Team Growth](https://us.i.posthog.com/project/483112/insights/9685409)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
