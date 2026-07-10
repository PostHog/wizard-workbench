<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A dedicated `PosthogService` singleton was created to wrap the PostHog JS SDK with SSR safety guards. PostHog is initialized in `AppComponent.ngOnInit()` using credentials sourced from environment variables. User identification runs on login (with `posthog.identify()`) and identity is cleared on logout (with `posthog.reset()`). Twelve events are now tracked across ten components covering auth, project management, team management, billing, profile, settings, and dashboard quick actions.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the application. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user successfully creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user successfully adds a new team member. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_viewed` | Fired when a user opens the billing page, marking the top of the plan upgrade funnel. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes a single active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `all_sessions_revoked` | Fired when a user revokes all other active sessions at once. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action button on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829158)
- [Daily Logins](https://us.posthog.com/project/483112/insights/ArZQb0Ui) — login count over the last 30 days
- [Billing conversion funnel](https://us.posthog.com/project/483112/insights/XpCcsX2c) — how many users who log in visit the billing page
- [Projects created](https://us.posthog.com/project/483112/insights/nNNYZZD8) — daily project creation trend
- [Quick actions by type](https://us.posthog.com/project/483112/insights/uzxJHi7J) — which quick actions users click most
- [User logouts](https://us.posthog.com/project/483112/insights/epfrfkHE) — logout trend as a churn signal

Dashboard subscription and alerts were skipped (wizard_ask unavailable in this environment). You can set up a weekly email digest from the dashboard's Share/Subscribe menu in PostHog, and add an alert on the Billing conversion funnel to be notified when conversion drops.

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login, but a page refresh while already authenticated will leave the session on an anonymous distinct ID until the next login.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
