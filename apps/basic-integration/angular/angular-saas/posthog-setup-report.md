<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Angular 21 SaaS application. A `PosthogService` singleton was created to initialize and wrap the PostHog JS SDK, using `NgZone.runOutsideAngular` to avoid unnecessary change detection cycles. PostHog is initialized in `AppComponent.ngOnInit` using environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`). User identification is performed on login using `posthog.identify()` with the user's ID and profile properties, and `posthog.reset()` is called on logout. Error tracking via `captureException` was added to key error paths. Fourteen events are tracked across the app's core flows including authentication, project management, team management, settings, billing, and security.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully completes login. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fires when a user is logged out and redirected to the login page. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fires when a user successfully creates a new project via the modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fires when a user successfully adds a new team member. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `dashboard_viewed` | Fires when the dashboard page is loaded. | `src/app/pages/dashboard/dashboard.component.ts` |
| `quick_action_clicked` | Fires when a user clicks a quick action button on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `profile_updated` | Fires when a user saves their profile information successfully. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fires when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fires when a user saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `theme_toggled` | Fires when a user switches between light and dark mode. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `billing_viewed` | Fires when the billing page is loaded. | `src/app/pages/billing/billing.component.ts` |
| `two_factor_auth_toggled` | Fires when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fires when a user revokes an active session from security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `users_list_viewed` | Fires when the team users list page is loaded. | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1775068)
- [User Login Activity](https://us.posthog.com/project/483112/insights/JgePrZ7x)
- [Project Creation Funnel](https://us.posthog.com/project/483112/insights/aEStLlsJ)
- [Team Growth Activity](https://us.posthog.com/project/483112/insights/6GubsIde)
- [Security Actions](https://us.posthog.com/project/483112/insights/VRqJUMnl)
- [Billing Page Views](https://us.posthog.com/project/483112/insights/KOSzriwZ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
