<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular 21 SaaS application. A singleton `PostHogService` was created to safely wrap posthog-js, handling SSR/browser platform checks. PostHog is initialized in `AppComponent.ngOnInit()` using environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`). Ten events covering the most business-critical user flows — authentication, billing upgrades, project creation, team growth, profile management, and security actions — were instrumented across nine components. Users are identified on login with `posthog.identify()` and the identity is reset on logout with `posthog.reset()`. Exception capture is enabled via `capture_exceptions: true` in the PostHog init config.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully completes the login form and is authenticated. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user completes the logout flow and their session is cleared. | `src/app/auth/logout/logout.component.ts` |
| `billing_page_viewed` | Fired when the billing page loads, marking the entry point of the plan upgrade funnel. | `src/app/pages/billing/billing.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks the Upgrade button on a billing plan card. | `src/app/pages/billing/billing.component.ts` |
| `project_created` | Fired when a user successfully submits the create project form. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a user successfully adds a new team member. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when a user saves changes to their profile information. | `src/app/pages/profile/profile.component.ts` |
| `two_factor_authentication_toggled` | Fired when a user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes one or all active sessions from the security settings. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_profile_viewed` | Fired when a user clicks on another team member's entry in the users list. | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793445)
- [Daily Logins](https://us.posthog.com/project/483112/insights/uAdzf4N7)
- [Billing upgrade funnel](https://us.posthog.com/project/483112/insights/bt4sM9gL)
- [Projects created over time](https://us.posthog.com/project/483112/insights/WcKvCDK0)
- [Team members added](https://us.posthog.com/project/483112/insights/6xm09t9v)
- [Security events](https://us.posthog.com/project/483112/insights/MSCzbsMU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
