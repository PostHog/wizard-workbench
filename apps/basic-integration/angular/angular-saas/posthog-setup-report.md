<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular 21 SaaS application. A `PostHogService` singleton was created in `src/app/@core/services/` following the Angular dependency injection pattern, and initialized in the root `AppComponent`. Environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`) were added to `.env` and referenced in `environment.ts` and `environment.prod.ts` via `import.meta.env`. User identification is wired into the login flow so every authenticated session is linked to a PostHog person profile. Ten business events were instrumented across authentication, project management, team growth, billing, and settings flows.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` to link the user | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Fired when a user logs out; calls `posthog.reset()` to clear the session | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project (includes name, status, and description flag) | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added (includes the assigned role) | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_viewed` | Fired on billing page load — marks the top of the upgrade conversion funnel | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | Fired when a user saves their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings are saved | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `security_2fa_toggled` | Fired when 2FA is enabled or disabled (includes `enabled` boolean) | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | Fired when notification preferences are saved (includes all toggle values) | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | Fired when display preferences are saved (theme, timezone, date format, landing page) | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |

## Next steps

We've outlined five insights to build in PostHog to keep an eye on user behavior. You can create these in the [Insights view](/insights):

1. **User logins over time** — Trend of `user_logged_in` events by week. Baseline engagement metric.
   [Create insight](/insights/new?insight=TRENDS)

2. **Login → Billing conversion funnel** — Funnel from `user_logged_in` → `billing_plan_viewed`. Shows what percentage of active users are exploring upgrade options.
   [Create insight](/insights/new?insight=FUNNELS)

3. **Projects created over time** — Weekly trend of `project_created`. Key growth and activation indicator.
   [Create insight](/insights/new?insight=TRENDS)

4. **Team members added over time** — Weekly trend of `member_added`, broken down by `member_role`. Shows team expansion and collaboration adoption.
   [Create insight](/insights/new?insight=TRENDS)

5. **Settings engagement** — Count of `account_settings_saved`, `notification_preferences_saved`, `preferences_saved` on a single chart. Low engagement here can signal churn risk.
   [Create insight](/insights/new?insight=TRENDS)

You can group all five on a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
