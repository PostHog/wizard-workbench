<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here's a summary of what was done:

**PostHog SDK installed** (`posthog-js`) and a singleton `PosthogService` was created at `src/app/services/posthog.service.ts`. It wraps the PostHog instance with SSR safety using `isPlatformBrowser()` checks and lazy initialization to prevent double-init.

**PostHog initialized** in `AppComponent.ngOnInit()` using credentials from the Angular environment files. Environment variables (`NG_APP_POSTHOG_PROJECT_TOKEN`, `NG_APP_POSTHOG_HOST`) were added to `.env` and referenced through `src/environments/environment.ts` and `src/environments/environment.prod.ts`.

**User identification** is performed on successful login (`login.component.ts`) using `posthog.identify()` with the user's ID, username, and email. `posthog.reset()` is called on logout to clear the session.

**12 events** were instrumented across 10 components covering login/logout, project creation, team management, billing, profile updates, settings changes, and quick actions.

**Exception capture** (`capture_exceptions: true`) is enabled globally, and login errors are also captured explicitly.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_upgrade_clicked` | User clicks upgrade on a billing plan | `src/app/pages/billing/billing.component.ts` |
| `billing_manage_subscription_clicked` | User clicks Manage Subscription | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | User enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `quick_action_clicked` | User clicks a dashboard quick action | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `user_profile_viewed` | User clicks on a user in the list | `src/app/pages/users/list/list.component.ts` |

## Next steps

Create the following insights in PostHog to monitor key user behavior from the events we just instrumented:

1. **Login trend** — [View logins over time](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9sb2dnZWRfaW4iLCJuYW1lIjoidXNlcl9sb2dnZWRfaW4iLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiZGlzcGxheSI6IkFjdGlvbnNMaW5lR3JhcGgifQ==)
   - Trend of `user_logged_in` over time

2. **Login → Project creation funnel** — Track conversion from login to project creation
   - Funnel: `user_logged_in` → `project_created`

3. **Billing upgrade interest** — Who is clicking upgrade plans
   - Trend of `billing_plan_upgrade_clicked` broken down by `plan_name` property

4. **Team growth** — Track `team_member_added` over time

5. **User churn signal** — Track `user_logged_out` trend vs `user_logged_in`

To create the "Analytics basics" dashboard and add these insights:
1. Go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)
2. Click **New dashboard** → name it "Analytics basics"
3. Create each insight above using **New insight** and add them to the dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
