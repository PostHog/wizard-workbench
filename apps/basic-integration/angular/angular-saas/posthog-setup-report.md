# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular SaaS application. A `PosthogService` singleton was created using Angular's dependency injection, initialized in the root `AppComponent`, and event tracking was added across 12 key user interaction points spanning authentication, project management, team growth, billing, security, and settings. User identification is performed on login using PostHog's `identify()` call, and `reset()` is called on logout. Error tracking via `captureException()` is added to error paths in login and logout flows.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in with their credentials. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out and their session is cleared. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a new team member is added via the add member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings including password changes. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `plan_selected` | Fired when a user selects a billing plan on the billing page. | `src/app/pages/billing/billing.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from another device. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks one of the quick action buttons on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_list_item_clicked` | Fired when a user clicks on a user item in the users list. | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761082)
- [Daily active logins](https://us.posthog.com/project/483112/insights/ajQzr0Ey)
- [Project creation funnel](https://us.posthog.com/project/483112/insights/9588491)
- [Plan upgrades](https://us.posthog.com/project/483112/insights/9588493)
- [Team growth](https://us.posthog.com/project/483112/insights/9588495)
- [Security actions](https://us.posthog.com/project/483112/insights/9588499)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
