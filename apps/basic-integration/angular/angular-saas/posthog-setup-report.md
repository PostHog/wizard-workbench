<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A new `PosthogService` singleton was created to wrap the PostHog JS SDK with SSR-safety guards. PostHog is initialized in `app.component.ts` using environment-sourced credentials, and already-authenticated users are re-identified on page load. Event capture was added to ten key user interactions across authentication, project management, team management, billing, and security settings. The SDK ships with `capture_exceptions: true` so all unhandled errors are automatically forwarded to PostHog Error Tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `project_created` | Fired when a user successfully creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user adds a new team member. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects a billing plan. | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1824463)
- [Login & Logout Trend (wizard)](https://us.posthog.com/project/483112/insights/S3nX7CjW)
- [Project Creation Funnel (wizard)](https://us.posthog.com/project/483112/insights/yiQrCIjN)
- [Billing Plan Selections (wizard)](https://us.posthog.com/project/483112/insights/7aKVvUY9)
- [Team Growth – Member Added (wizard)](https://us.posthog.com/project/483112/insights/IOjbSEkY)
- [Security Events Overview (wizard)](https://us.posthog.com/project/483112/insights/gkcdbqii)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` (or equivalent) and any onboarding/bootstrap docs so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard added a re-identify call in `app.component.ts` on init, but verify this path runs before any events are captured in your specific auth flow.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
