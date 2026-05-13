<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. Here is a summary of all changes made:

**New files created:**
- `src/app/@core/services/posthog.service.ts` — Singleton Angular service wrapping the PostHog SDK. Uses `isPlatformBrowser` for SSR safety and provides a no-op proxy when running server-side.
- `src/env.d.ts` — TypeScript declarations for `import.meta.env` environment variables used by Angular's build system.

**Environment setup:**
- `.env` — PostHog project token and host configured as `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST`, read at build time via Angular CLI's native `NG_APP_*` env support.
- `src/environments/environment.ts` and `environment.prod.ts` — Added `posthogKey` and `posthogHost` fields sourced from `import.meta.env`.

**PostHog initialization:**
- `src/app/app.component.ts` — Calls `posthogService.init()` in `ngOnInit` with the project key, host, and `capture_exceptions: true` for automatic error tracking.

**Event tracking instrumented across 10 files:**

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Calls `posthog.identify()` with the user's ID, username, and email. | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired on logout. Calls `posthog.reset()` to clear the user identity. | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created. Includes project name, status, and whether a description was provided. | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a new team member is added. Includes the member's assigned role. | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_upgrade_clicked` | Fired when a user clicks Upgrade on a billing plan. Includes plan ID, name, price, and the user's current plan. | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile. | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings are saved. Includes whether the user changed their password. | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | Fired when notification preferences are saved. Includes all individual notification toggle states. | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | Fired when 2FA is enabled or disabled. Includes the resulting enabled state. | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a dashboard quick action button is clicked. Includes the action ID and label. | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We've set up an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Open the dashboard and add the following insights:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1119959)

**Suggested insights to create:**

1. **Login → Project Created funnel** — Track conversion from `user_logged_in` to `project_created` to measure how many users who log in go on to create a project.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Daily active users** — Trend of `user_logged_in` events over time to measure daily active user counts.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Plan upgrade interest** — Trend of `plan_upgrade_clicked` to measure upgrade intent and which plans are most popular.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Team growth** — Trend of `team_member_added` over time to track team expansion.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Security adoption** — Trend of `two_factor_authentication_toggled` filtered to `enabled = true` to track 2FA adoption.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
