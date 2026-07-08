<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Angular SaaS application. A singleton `PostHogService` was created and wired into the root `AppComponent`, which initialises the SDK on browser startup using credentials read from environment variables. User identification is performed on login (`posthog.identify()`) and the session is reset on logout (`posthog.reset()`). Twelve business events are now captured across authentication, project creation, team management, billing, security, and settings flows. Exception capture (`captureException`) is also wired into the login error handler.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and logs into the application. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member to the organisation. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings including profile info and password. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `plan_upgrade_initiated` | User selects a new billing plan to upgrade to. | `src/app/pages/billing/billing.component.ts` |
| `tfa_toggled` | User enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes a specific active session from another device. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_sessions_revoked` | User revokes all other active sessions at once. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves their notification preference settings. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `user_profile_viewed` | User clicks to view a team member's profile in the user list. | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818087)
- [Daily logins](https://us.posthog.com/project/483112/insights/aCAu83jp)
- [Login-to-upgrade funnel](https://us.posthog.com/project/483112/insights/3fdm1k7x)
- [Project & team growth](https://us.posthog.com/project/483112/insights/1Z0Wrv6z)
- [Churn indicator — logouts](https://us.posthog.com/project/483112/insights/4ZMSY2fE)
- [Plan upgrade breakdown by plan](https://us.posthog.com/project/483112/insights/251M8mlR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` only fires on fresh login; a handler for already-authenticated page refreshes (reading credentials from `CredentialsService`) should also call `posthog.identify()` to prevent returning sessions landing on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
