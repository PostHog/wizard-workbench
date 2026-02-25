<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Angular SaaS application. Here's what was done:

**New files created:**
- `src/app/services/posthog.service.ts` — Singleton Angular service wrapping `posthog-js`. Initializes PostHog outside the Angular zone (for performance with session replay), uses `isPlatformBrowser` for SSR safety, and exposes a `posthog` getter that returns a no-op proxy when not in a browser context.
- `src/env.d.ts` — TypeScript declarations for `import.meta.env` to support `NG_APP_*` environment variables with the Angular Vite builder.
- `.env` — Environment file containing `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST` (gitignored).

**Modified files:**
- `src/environments/environment.ts` / `environment.prod.ts` — Added `posthogKey` and `posthogHost` fields sourced from `import.meta.env['NG_APP_POSTHOG_KEY']` / `import.meta.env['NG_APP_POSTHOG_HOST']`.
- `src/app/app.component.ts` — Injected `PosthogService` to trigger initialization on app start.
- 10 component files — Added `posthog.capture()` calls for 13 business events across authentication, billing, project management, team management, profile, and settings flows. Login success also calls `posthog.identify()` to associate events with the logged-in user.

| Event | Description | File |
|---|---|---|
| `login_submitted` | User submits the login form | `src/app/auth/login/login.component.ts` |
| `login_succeeded` | User successfully authenticated and redirected to dashboard | `src/app/auth/login/login.component.ts` |
| `login_failed` | Login attempt failed due to invalid credentials or error | `src/app/auth/login/login.component.ts` |
| `logged_out` | User logged out and session was cleared | `src/app/auth/logout/logout.component.ts` |
| `plan_upgrade_clicked` | User clicked the Upgrade button on a billing plan | `src/app/pages/billing/billing.component.ts` |
| `project_created` | User successfully created a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User added a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saved changes to their profile information | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saved account settings (profile info or password change) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `tfa_toggled` | User enabled or disabled two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revoked one or all other active sessions | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saved their notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `preferences_saved` | User saved display and UI preferences (theme, date format, timezone, landing page) | `src/app/pages/settings/components/preferences-settings/preferences-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Analytics basics dashboard**: https://us.posthog.com/project/238460/dashboard/1262598
  - [User Auth Trend](https://us.posthog.com/project/238460/insights/od6OtOUD) — Daily login/logout trends
  - [Team & Project Actions](https://us.posthog.com/project/238460/insights/fXz2ZCBS) — Project creation and member additions
  - [Settings & Security Activity](https://us.posthog.com/project/238460/insights/ypLalI4y) — Account settings saves and security actions
  - [Billing Page Funnel](https://us.posthog.com/project/238460/insights/9QeEIAN7) — Upgrade funnel tracking
  - [Quick Actions Usage](https://us.posthog.com/project/238460/insights/nepFSPxN) — Dashboard quick action clicks

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
