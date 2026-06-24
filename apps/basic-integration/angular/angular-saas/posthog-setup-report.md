<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A singleton `PostHogService` was created to wrap the PostHog JS SDK in an SSR-safe way. PostHog is initialized in `AppComponent.ngOnInit()` using environment variables. User identification occurs at login via `AuthenticationService`, with `posthog.reset()` called on logout. Nine events are captured across authentication, project management, team management, billing, profile, and security settings flows.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in to the app. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out of the app. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project via the create project modal. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a new team member is added via the add member modal. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_selected` | Fired when a user selects a billing plan on the billing page. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile information. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_authentication_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session from the security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [User Login Funnel](https://us.posthog.com/project/483112/insights/CmyVjNEN)
- [Daily Active Users (Logins)](https://us.posthog.com/project/483112/insights/Mov0zExa)
- [Plan Selection Breakdown](https://us.posthog.com/project/483112/insights/GWHgu6vp)
- [Team Growth (Members Added)](https://us.posthog.com/project/483112/insights/o7h0E6qY)
- [Session Security Events](https://us.posthog.com/project/483112/insights/jp3dgxJ5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
