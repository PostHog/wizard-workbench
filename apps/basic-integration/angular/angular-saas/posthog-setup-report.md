<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A `PostHogService` singleton was created to wrap the PostHog JS SDK with SSR safety, and it is initialized in the root `AppComponent`. PostHog credentials are read from environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN` / `NG_APP_POSTHOG_HOST`) via `import.meta.env`, supported natively by the `@angular/build:application` builder. Users are identified on login (with `posthog.identify`) and the session is reset on logout (`posthog.reset`). Error tracking is enabled at init via `capture_exceptions: true`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully logs in. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fires when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fires when a user creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fires when a user adds a new member to the team. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_page_viewed` | Fires when a user views the billing page (top of upgrade funnel). | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fires when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fires when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_authentication_toggled` | Fires when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fires when a user revokes an active session from another device. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fires when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Fires when a user saves their display and UI preferences. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `quick_action_clicked` | Fires when a user clicks a quick action button on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818068)
- [Login to Project Creation funnel](https://us.posthog.com/project/483112/insights/5QYsfXzb)
- [Daily logins and logouts](https://us.posthog.com/project/483112/insights/DeWuGENb)
- [Project and team growth](https://us.posthog.com/project/483112/insights/jTkoDX0w)
- [Billing page to account settings engagement funnel](https://us.posthog.com/project/483112/insights/OMKFHPbu)
- [Quick action clicks by type](https://us.posthog.com/project/483112/insights/eEF1dncC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on the login form submit; users who reload the page while already authenticated will be on anonymous distinct IDs until they log out and back in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
