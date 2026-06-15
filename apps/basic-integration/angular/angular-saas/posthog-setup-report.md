<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. A `PostHogService` singleton was created to wrap the PostHog JS SDK with SSR-safe initialization. The service is initialized in `AppComponent.ngOnInit()` using credentials from environment files. User identification is performed on login via `AuthenticationService`, and `posthog.reset()` is called on logout to clear session state. Ten business-critical events are now tracked across authentication, billing, project management, team management, profile updates, and security settings.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logs out of the application | `src/app/auth/services/authentication.service.ts` |
| `plan_upgrade_clicked` | User clicks to upgrade their subscription plan | `src/app/pages/billing/billing.component.ts` |
| `project_created` | User successfully creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saves their profile information | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session from another device | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves their notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |

## Next steps

The PostHog MCP API key used by the wizard was missing `dashboard:write` and `query:read` scopes, so the dashboard could not be created automatically. To create a dashboard named **"Analytics basics (wizard)"**, visit PostHog and add insights for the events above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [PostHog Insights](https://us.posthog.com/project/2/insights)

Suggested insights to build:
1. **Login trend** — Trend of `user_logged_in` over time
2. **Login → Plan upgrade funnel** — Funnel: `user_logged_in` → `plan_upgrade_clicked`
3. **Project creation rate** — Trend of `project_created` over time
4. **Team growth** — Trend of `team_member_added` over time
5. **2FA adoption** — Breakdown of `two_factor_auth_toggled` by the `enabled` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
