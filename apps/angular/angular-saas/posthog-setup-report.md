<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Angular SaaS application. `posthog-js` was installed and a singleton `PosthogService` was created that wraps the SDK with SSR safety (via `isPlatformBrowser`) and runs initialization outside Angular's zone to prevent change detection overhead. PostHog is initialized in `AppComponent.ngOnInit()` using credentials from environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`). On login, `posthog.identify()` is called with the user's ID, username, and email to correlate all future events. On logout, `posthog.reset()` is called to clear the identity. Exception capture is enabled via `capture_exceptions: true`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logged out of their account | `src/app/auth/logout/logout.component.ts` |
| `billing_page_viewed` | User viewed the billing and subscription page | `src/app/pages/billing/billing.component.ts` |
| `plan_upgrade_clicked` | User clicked to upgrade to a new plan | `src/app/pages/billing/billing.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `quick_action_clicked` | User clicked a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `profile_updated` | User saved changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saved account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saved notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_auth_toggled` | User enabled or disabled 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |

## Next steps

We've built an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Recommended insights to add:

1. **Login trend** — Trends insight on `user_logged_in` over time, to track daily/weekly active users
2. **Billing upgrade funnel** — Funnel insight: `billing_page_viewed` → `plan_upgrade_clicked`, to measure conversion rate
3. **Plan upgrade breakdown** — Trends insight on `plan_upgrade_clicked`, broken down by `plan_name` property
4. **Project creation rate** — Trends insight on `project_created` over time
5. **Quick action usage** — Trends insight on `quick_action_clicked`, broken down by `action_label` property

- Dashboard: https://us.posthog.com/project/2/dashboard/1344803
- New insight: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
