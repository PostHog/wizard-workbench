<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The integration adds a singleton `PostHogService` wrapper that handles SSR safety via `isPlatformBrowser` checks, initializes PostHog in the root `AppComponent`, instruments 10 business-critical events across 9 files, identifies users on login, resets identity on logout, and captures HTTP errors via the existing `ErrorHandlerInterceptor`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates and is identified. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out and their session is cleared. | `src/app/auth/logout/logout.component.ts` |
| `dashboard_viewed` | Fired when a user lands on the main dashboard (top of post-login funnel). | `src/app/pages/dashboard/dashboard.component.ts` |
| `project_created` | Fired when a user creates a new project via the modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user adds a new team member via the modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_upgrade_clicked` | Fired when a user clicks Upgrade on a billing plan card. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

Dashboard creation was skipped because the current API key is missing the `dashboard:write` scope. Once the scope is added (or a new key with full provisioning scopes is used), you can create a dashboard manually in PostHog with insights such as:

- **Funnel**: `user_logged_in` → `dashboard_viewed` → `project_created` (conversion funnel)
- **Trend**: `user_logged_in` over time (daily active logins)
- **Trend**: `project_created` over time (product adoption)
- **Trend**: `billing_plan_upgrade_clicked` over time (upgrade intent)
- **Trend**: `member_added` over time (team growth)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies only on fresh login, which can leave returning sessions on anonymous distinct IDs. Consider calling `identify` on app init if a session/credentials are already stored.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
