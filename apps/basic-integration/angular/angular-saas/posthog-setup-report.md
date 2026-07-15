<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Angular 21 SaaS application. A `PosthogService` singleton was created using Angular's dependency injection (`inject()` + `NgZone.runOutsideAngular`) to initialize the SDK outside Angular's change-detection zone, keeping session recording performant. PostHog is initialized early by injecting the service into `AppComponent`. Environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`) are read from `src/environments/.env.ts` and surfaced via `environment.posthogKey` / `environment.posthogHost`. Eleven business-critical events were instrumented across authentication, project management, team growth, settings, and the billing conversion funnel. `posthog.identify()` is called on login with the user's stable ID, and `posthog.reset()` is called on logout. The `capture_exceptions: true` option enables automatic error tracking via PostHog's exception capture.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user adds a new team member via the add member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action button on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks the upgrade button on a billing plan. | `src/app/pages/billing/billing.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1853414)
- [User logins over time (wizard)](https://us.i.posthog.com/project/483112/insights/10142627)
- [Login to project creation funnel (wizard)](https://us.i.posthog.com/project/483112/insights/10142632)
- [Plan upgrade clicks by plan (wizard)](https://us.i.posthog.com/project/483112/insights/10142633)
- [Members added over time (wizard)](https://us.i.posthog.com/project/483112/insights/10142634)
- [User logouts over time (wizard)](https://us.i.posthog.com/project/483112/insights/10142638)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
