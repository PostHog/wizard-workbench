<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular SaaS application. A `PostHogService` singleton was created and used to initialize PostHog in the root `AppComponent`. User identification (`posthog.identify`) fires on login and `posthog.reset()` fires on logout to correctly associate sessions with users. Ten business events are instrumented across authentication, project management, team management, settings, and billing flows. Exception capture (`capture_exceptions: true`) is also enabled for automatic error tracking. Environment variables are read via `import.meta.env` (Angular 21's Vite-backed build supports `NG_APP_*` prefix variables from `.env`), with type declarations added in `src/env.d.ts`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on successful login; also calls `identify()` with user details | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired on logout; also calls `posthog.reset()` to clear identity | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a project is created via the create-project modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a team member is added via the add-member modal | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fired when the user saves their profile form | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings (name, email, or password) are saved | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when 2FA is enabled or disabled; includes `enabled` property | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `billing_plan_viewed` | Fired when the billing page loads (top of upgrade funnel) | `src/app/pages/billing/billing.component.ts` |
| `account_deleted` | Fired when the Delete Account button is clicked | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |

## Next steps

Create an **"Analytics basics (wizard)"** dashboard in PostHog with these five insights. Use [New insight](https://us.posthog.com/project/2/insights/new) for each, then pin them to the [Dashboards page](https://us.posthog.com/project/2/dashboard):

1. **Login trend** — Trends: `user_logged_in` over time. Tracks daily active logins.
2. **Billing-to-project conversion funnel** — Funnel: `billing_plan_viewed` → `project_created`. Measures how many users who view billing go on to create a project.
3. **Account churn** — Trends: `account_deleted` over time. Monitors churn risk signals.
4. **Feature adoption** — Trends: `project_created` + `team_member_added` on the same chart. Shows product usage growth.
5. **Security engagement** — Trends: `two_factor_auth_toggled` + `session_revoked`. Tracks security-conscious user behavior.

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called in `LoginComponent`. If users can reload the app and remain authenticated without going through the login flow, add an `identify` call in `AppComponent.ngOnInit` using credentials from `CredentialsService`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
