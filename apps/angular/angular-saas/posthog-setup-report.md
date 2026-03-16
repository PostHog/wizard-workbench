<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. Here's a summary of all changes made:

- **`posthog-js`** was installed as a dependency.
- **`src/environments/.env.ts`** was updated to include `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` keys.
- **`src/environments/environment.ts`** and **`src/environments/environment.prod.ts`** were updated to expose `posthogKey` and `posthogHost` from environment configuration.
- **`.env`** was created with PostHog public token and host values (covered by `.gitignore`).
- **`src/app/services/posthog.service.ts`** (new file) — A singleton `PostHogService` was created that wraps posthog-js with SSR safety using `isPlatformBrowser`.
- **`src/app/app.component.ts`** was updated to initialize PostHog on app start via `PostHogService.init()`.
- User identification via `posthog.identify()` was added on login and `posthog.reset()` on logout.
- 10 analytics events were instrumented across 8 files.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `src/app/auth/services/authentication.service.ts` |
| `user_logged_out` | User logged out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | User selected a billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | User saved account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_settings_saved` | User saved notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_toggled` | User enabled or disabled 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `user_profile_viewed` | User viewed a team member's profile | `src/app/pages/users/list/list.component.ts` |

## Next steps

To build insights and a dashboard in PostHog, navigate to your [PostHog project](https://us.i.posthog.com/project/2) and create the following recommended insights:

- **User Login Trend** — Track `user_logged_in` over time to monitor daily/weekly active users.
- **Login → Project Created Funnel** — Funnel from `user_logged_in` → `project_created` to measure onboarding conversion.
- **Plan Upgrade Funnel** — Funnel from `user_logged_in` → `plan_selected` (filter by non-free plans) to measure upgrade conversion.
- **Member Invitation Rate** — Track `member_added` to measure team growth and collaboration.
- **Churn Signal: Logout Rate** — Track `user_logged_out` events relative to logins to identify disengagement.

Once you have data flowing, create a dashboard called "Analytics basics" and add these insights to it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
