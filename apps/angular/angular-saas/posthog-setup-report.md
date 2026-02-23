<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular SaaS application. Here's a summary of all changes made:

## What was done

- **Installed** `posthog-js` as a project dependency
- **Created** `src/app/services/posthog.service.ts` — a singleton root service wrapping the PostHog SDK with SSR-safe proxy (no-op on server, real instance on browser), following Angular dependency injection best practices using `inject()` and `PLATFORM_ID`
- **Created** `src/env.d.ts` — TypeScript type declarations for `import.meta.env` environment variables
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` — added `posthogKey` and `posthogHost` properties reading from environment variables (`NG_APP_POSTHOG_KEY`, `NG_APP_POSTHOG_HOST`)
- **Updated** `.env` — populated `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST` (gitignore coverage ensured)
- **Initialized PostHog** in `src/app/app.component.ts` via the PostHog service in `ngOnInit`, with `capture_exceptions: true` for automatic error tracking
- **Added user identification** on login in `src/app/auth/login/login.component.ts` — calls `posthog.identify()` with user ID, email, and name; resets identity on logout
- **Added 13 event captures** across 10 files tracking all key user actions

## Tracked events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a new project is created via the create project modal | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | Fired when a new team member is added via the add member modal | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_viewed` | Fired when a user views the billing page — top of conversion funnel | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | Fired when a user revokes a session from security settings | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |
| `profile_updated` | Fired when a user saves their profile | `src/app/pages/profile/profile.component.ts` |
| `user_list_viewed` | Fired when users list is loaded — top of user management funnel | `src/app/pages/users/list/list.component.ts` |
| `$exception` (login error) | Captures login errors for PostHog error tracking | `src/app/auth/login/login.component.ts` |
| `$exception` (user load error) | Captures user list load errors for PostHog error tracking | `src/app/pages/users/list/list.component.ts` |

## Next steps

We've identified a closely matching "Analytics basics" dashboard in your PostHog project that covers team management, project creation, and user authentication events — ideal for monitoring your SaaS app:

- **[Analytics basics dashboard — Team Management & Project Creation](https://us.posthog.com/project/2/dashboard/1271505)** — includes:
  - [User Authentication Activity](https://us.posthog.com/project/2/insights/Kb4yXiND) — sign-in/sign-out trends
  - [User Onboarding Funnel](https://us.posthog.com/project/2/insights/zWcUP6pF) — sign-in → team → project creation funnel
  - [Team & Project Growth](https://us.posthog.com/project/2/insights/VLjDfuZ9) — project creation rates
  - [Member Collaboration Activity](https://us.posthog.com/project/2/insights/saoLKzkg) — member additions
  - [Error & Failure Events](https://us.posthog.com/project/2/insights/3CQnEdV2) — failure monitoring

To build custom insights for the new events (`billing_plan_viewed`, `two_factor_auth_toggled`, `session_revoked`, `quick_action_clicked`, `profile_updated`), visit [PostHog Insights](https://us.posthog.com/project/2/insights/new) and create trend or funnel charts using those event names.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
