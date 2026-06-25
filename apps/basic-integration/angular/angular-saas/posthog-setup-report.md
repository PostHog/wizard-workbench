<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A `PostHogService` singleton was created and initialized in the root component, providing SSR-safe access to the PostHog SDK across the entire app. Environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`) are read via `import.meta.env` and stored in `environment.ts` / `environment.prod.ts`. User identification is performed on login using `posthog.identify()` and sessions are reset on logout with `posthog.reset()`. Error tracking via `captureException` was added to the login error handler.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs into the application. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user successfully creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user adds a new member to the team. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action button on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_list_item_clicked` | Fired when a user clicks on an item in the users list. | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [User Login Trend](https://us.i.posthog.com/project/483112/insights/rQxE2wm9)
- [User Acquisition Funnel](https://us.i.posthog.com/project/483112/insights/pb2PRalr) — login → project_created conversion
- [Project & Member Creation](https://us.i.posthog.com/project/483112/insights/L3aZcO4F)
- [Security Actions](https://us.i.posthog.com/project/483112/insights/b5H6zLnH)
- [User Retention / Churn](https://us.i.posthog.com/project/483112/insights/6AM8rRICagentId)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
