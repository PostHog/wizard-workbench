<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. The integration includes:

- **PostHog SDK installed**: `posthog-js` added via npm.
- **Environment variables configured**: `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` added to `.env` (gitignored). Both `environment.ts` and `environment.prod.ts` read these via `import.meta.env`.
- **TypeScript declarations**: `src/env.d.ts` created to type `import.meta.env` for Angular's Vite-based build system.
- **PosthogService created**: `src/app/services/posthog.service.ts` — a singleton root service that initializes PostHog outside the Angular zone (to avoid change detection performance issues with session recording) and provides the `posthog` instance.
- **AppComponent updated**: `PosthogService` injected to ensure PostHog initializes on app startup.
- **User identification**: `posthog.identify()` called in `login.component.ts` on successful login with user email, username, and name properties.
- **Session reset**: `posthog.reset()` called in `logout.component.ts` on logout to clear the PostHog session.
- **Error tracking**: `posthog.captureException()` added in `login.component.ts` (login errors) and `profile.component.ts` (profile save errors).
- **12 custom events** instrumented across 9 files (see table below).

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and logged in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User signed out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saved changes to their profile | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saved account settings (profile info or password) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saved their notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | User enabled or disabled two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | User clicked a quick action button on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `billing_viewed` | User viewed the billing page — top of the plan upgrade funnel | `src/app/pages/billing/billing.component.ts` |
| `user_clicked` | User clicked on a team member row in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

A PostHog dashboard could not be auto-created because the connected API key is missing the `dashboard:write` and `query:read` scopes. To create the **"Analytics basics"** dashboard manually, visit your [PostHog project](https://us.posthog.com/project/2/dashboard) and add these recommended insights:

1. **Login trend** — Trends insight on `user_logged_in` over time to track daily/weekly active users.
2. **Login → Billing upgrade funnel** — Funnel: `user_logged_in` → `billing_viewed` to measure how many users explore upgrading their plan.
3. **Project creation trend** — Trends insight on `project_created` to track growth in project creation.
4. **Member invitation trend** — Trends insight on `member_added` to track team growth signals.
5. **Quick action breakdown** — Trends insight on `quick_action_clicked` broken down by `action_label` to see which dashboard actions are most popular.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
