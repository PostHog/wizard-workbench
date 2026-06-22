<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A singleton `PostHogService` was created to wrap the PostHog SDK in an SSR-safe proxy, and PostHog is initialised in the root `AppComponent` using credentials from environment variables. User identification is performed on login via `posthog.identify()` and cleared on logout via `posthog.reset()`. Ten business events are captured across the authentication, billing, project management, team management, profile, settings, and users list flows. Environment variables are stored in `.env` (gitignored) and referenced through `src/environments/environment.ts` using `import.meta.env`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully logs in. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fires when a user logs out of the application. | `src/app/auth/logout/logout.component.ts` |
| `plan_upgrade_clicked` | Fires when a user clicks the Upgrade button on a billing plan. | `src/app/pages/billing/billing.component.ts` |
| `project_created` | Fires when a user successfully creates a new project. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fires when a new team member is successfully added. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | Fires when a user saves changes to their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fires when account settings (profile info or password) are saved. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fires when the user enables or disables two-factor authentication. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fires when a user revokes an active session. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_clicked` | Fires when a user row is clicked in the users list. | `src/app/pages/users/list/list.component.ts` |

## Next steps

A dashboard named "Analytics basics (wizard)" was planned with the following insights — create these manually in PostHog if the wizard was unable to create them automatically:

- **Daily Active Users** — trend of unique users who triggered `user_logged_in` over time
- **Plan Upgrade Funnel** — funnel from `user_logged_in` → `plan_upgrade_clicked`
- **Project Creation Rate** — trend of `project_created` events over time
- **Team Growth** — trend of `member_added` events over time
- **User Churn** — trend of `user_logged_out` events over time

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo or bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login, which can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
