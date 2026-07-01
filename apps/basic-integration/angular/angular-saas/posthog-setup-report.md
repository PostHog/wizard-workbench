<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A singleton `PosthogService` was created wrapping the PostHog JS SDK with NgZone and SSR-safe guards. The service is initialized in `AppComponent.ngOnInit()` using environment variables for the API key and host. User identification is performed at login, and `posthog.reset()` is called on logout. Ten business-critical events were added across auth, project management, billing, profile, settings, and HTTP error flows.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user completes the logout flow. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user adds a new team member via the add member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_page_viewed` | Fired when a user views the billing page, marking the top of the upgrade conversion funnel. | `src/app/pages/billing/billing.component.ts` |
| `profile_saved` | Fired when a user saves their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from the security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `http_error_captured` | Fired when an HTTP error is caught by the global error handler interceptor. | `src/app/@core/interceptors/error-handler.interceptor.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787328)
- [User Login Trend](https://us.posthog.com/project/483112/insights/lGH7FJaP)
- [Login vs Logout](https://us.posthog.com/project/483112/insights/5cLMRPg2)
- [Project Creation Activity](https://us.posthog.com/project/483112/insights/sNfFjhii)
- [Billing Page Conversion Funnel](https://us.posthog.com/project/483112/insights/ARgo66QG)
- [Team Growth](https://us.posthog.com/project/483112/insights/a2AGnVvT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
