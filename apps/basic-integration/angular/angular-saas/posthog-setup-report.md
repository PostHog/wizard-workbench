<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A `PosthogService` singleton was created and initialized in `AppComponent`, with user identification on login, on app startup for returning users, and `posthog.reset()` on logout. Ten business-critical events are now captured across the authentication, project management, billing, profile, and settings flows. Exception capture (`capture_exceptions: true`) is enabled globally.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with their credentials. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out and ends their session. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new member to the team. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | User selects or changes their billing plan. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings including profile info or password change. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | User enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes one or all of their active sessions. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807642)
- [Daily User Logins](https://us.posthog.com/project/483112/insights/ooMlt2OP)
- [Login to Project Creation Funnel](https://us.posthog.com/project/483112/insights/iSNA9CIB)
- [Key Business Actions Over Time](https://us.posthog.com/project/483112/insights/8ForM6WV)
- [User Churn (Logouts) Over Time](https://us.posthog.com/project/483112/insights/AGOv0tSF)
- [Settings Engagement Over Time](https://us.posthog.com/project/483112/insights/lqyPeklS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. Since `@angular/build:application` reads `NG_APP_*` env vars from the process environment, collaborators must set these before running `ng serve` or `ng build` (e.g. via `dotenv-cli` or their shell profile).
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added an `identify` call in `AppComponent.ngOnInit` that fires when a user is already authenticated on app startup, covering this case.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
