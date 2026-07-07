<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Angular 21 SaaS application. `posthog-js` was installed and a singleton `PosthogService` was created at `src/app/services/posthog.service.ts`. The service initialises PostHog outside Angular's change-detection zone (using `NgZone.runOutsideAngular`) to avoid session-recording performance issues, and guards all browser-only calls with `isPlatformBrowser` for SSR safety. PostHog credentials are stored in `src/environments/.env.ts` and surfaced through the environment files.

User identification (`posthog.identify`) is called immediately after a successful login, using the authenticated user's stable UUID as the distinct ID and setting name, email, username, and roles as person properties. `posthog.reset()` is called on logout to unlink future events from the departing session. Fourteen business-critical events were instrumented across auth, billing, project/team management, profile, settings, and the dashboard quick-actions widget.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates and is redirected to the dashboard. | `src/app/auth/login/login.component.ts` |
| `user_signed_out` | User completes the logout flow and is redirected to the login page. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User submits the create-project form and a new project is added. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_invited` | User adds a new team member via the add-member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | User clicks to select or switch to a billing plan. | `src/app/pages/billing/billing.component.ts` |
| `invoice_downloaded` | User clicks to download a specific invoice. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves changes in the account settings form. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `account_deletion_requested` | User clicks the Delete Account button in the danger zone. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_authentication_toggled` | User enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session from the security settings panel. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves their notification preferences. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | User saves display and UI preferences such as theme, timezone, and date format. | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |
| `quick_action_clicked` | User clicks one of the quick-action buttons on the dashboard. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812958)
- [User sign-ins](https://us.posthog.com/project/483112/insights/rxskC9h6) — Daily sign-in trend (last 30 days)
- [Login to project creation funnel](https://us.posthog.com/project/483112/insights/v3Gzu4S6) — Conversion from sign-in → project created
- [Plan selections by plan](https://us.posthog.com/project/483112/insights/3eBe02j8) — Which plans users upgrade to
- [Team member invitations by role](https://us.posthog.com/project/483112/insights/NTC5qry3) — Member invites broken down by role
- [Sign-ins vs sign-outs](https://us.posthog.com/project/483112/insights/F4IridUU) — Side-by-side churn signal

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. Also update `src/environments/.env.ts` with the real values in your CI environment.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called only on fresh login. If a returning user refreshes without logging in again, their session will be anonymous until they log in. Consider calling `identify` in `AppComponent.ngOnInit` when `CredentialsService.credentials()` is non-null.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
