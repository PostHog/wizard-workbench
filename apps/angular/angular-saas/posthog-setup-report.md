<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. A `PostHogService` singleton was created to wrap the PostHog JS SDK with SSR safety, and PostHog is initialized in the root `AppComponent` using environment variables. Users are identified at login via `posthog.identify()` and their session is reset on logout with `posthog.reset()`. Ten custom events were instrumented across eleven files covering authentication, project and team management, user settings, and the billing conversion funnel.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a team member is added | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `quick_action_clicked` | Fired when a quick action button is clicked from the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `profile_updated` | Fired when a user saves their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | Fired when account settings are saved | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_toggled` | Fired when a user enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `billing_plan_viewed` | Fired when a user views the billing page (top of conversion funnel) | `src/app/pages/billing/billing.component.ts` |

## Next steps

We've configured your app to send the events above to PostHog. To visualize them, create an **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and add the following insights:

1. **User Login Trend** — Trends chart for `user_logged_in` over the last 30 days. Shows daily active user patterns.
2. **Project Creation Funnel** — Funnel from `billing_plan_viewed` → `project_created`. Measures conversion from billing interest to project action.
3. **Quick Actions Breakdown** — Trends chart for `quick_action_clicked` broken down by `action_label`. Shows which actions drive most engagement.
4. **Security Settings Adoption** — Trends chart for `two_factor_toggled` filtered to `enabled = true`. Tracks 2FA adoption over time.
5. **Member Growth** — Cumulative trends chart for `member_added`. Tracks team growth as a churn/retention proxy.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
