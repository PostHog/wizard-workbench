<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The following changes were made:

- **Installed** `posthog-js` via npm.
- **Created** `src/env.d.ts` with `ImportMeta` type declarations for `NG_APP_*` environment variables.
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` to include `posthogKey` and `posthogHost` using `import.meta.env`.
- **Created** `src/app/@core/services/posthog.service.ts` — a singleton root service wrapping the PostHog SDK with browser-safety checks (`isPlatformBrowser`).
- **Updated** `src/app/@core/services/index.ts` to export `PosthogService`.
- **Updated** `src/app/app.component.ts` to initialize PostHog on app boot with `capture_exceptions: true` and the `2026-01-30` defaults.
- **Added** `posthog.identify()` in `login.component.ts` on successful login.
- **Added** event captures across 12 components covering auth, billing, settings, and team management.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the application. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user successfully creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user adds a new member to the team. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks the Upgrade button on a billing plan. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Fired when a user saves their display preferences such as theme or date format. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from the security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `dashboard_viewed` | Fired when a user lands on the main dashboard, marking the top of the key conversion funnel. | `src/app/pages/dashboard/dashboard.component.ts` |

## Next steps

Visit your PostHog project to create a dashboard for these events. The recommended insights are:

- **Login trend** — Trends chart for `user_logged_in` over time (daily/weekly).
- **Project creation funnel** — Funnel: `dashboard_viewed` → `project_created`.
- **Plan upgrade interest** — Trends chart for `plan_upgrade_clicked` broken down by `plan_name`.
- **Security activity** — Trends chart for `two_factor_auth_toggled` and `session_revoked`.
- **Settings engagement** — Trends chart combining `account_settings_saved`, `notification_preferences_saved`, and `preferences_saved`.

[Create a new dashboard in PostHog](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `identify` call only fires on fresh login; returning sessions that restore credentials from localStorage will be on anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
