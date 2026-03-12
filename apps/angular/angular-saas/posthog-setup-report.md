<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Angular SaaS application. The following changes were made:

- **Created** `src/app/shared/services/posthog.service.ts` — A singleton Angular service wrapping the PostHog SDK, with SSR-safe browser detection and a no-op proxy for server environments.
- **Created** `src/env.d.ts` — TypeScript type declarations for `import.meta.env` environment variables.
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` — Added `posthogKey` and `posthogHost` fields reading from `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` environment variables.
- **Updated** `.env` — Added `NG_APP_POSTHOG_PROJECT_TOKEN` and `NG_APP_POSTHOG_HOST` secrets (gitignore-covered).
- **Updated** `src/app/app.component.ts` — Initializes PostHog on app startup with `capture_exceptions: true` for automatic error tracking.
- **Updated** `src/app/shared/services/index.ts` — Exported the new `PostHogService`.
- **Added event tracking** across 8 additional files (see table below).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully logs in; also calls `posthog.identify()` with user details | `src/app/auth/services/authentication.service.ts` |
| `user_signed_out` | User logs out; also calls `posthog.reset()` | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User adds a team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | User selects or upgrades a billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `profile_updated` | User updates their profile | `src/app/pages/profile/profile.component.ts` |
| `two_factor_auth_toggled` | User enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `quick_action_clicked` | User clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the PostHog API key is read-only. To build it manually, visit your PostHog project and create a dashboard with these recommended insights:

1. **Daily Active Users** — Trend of `user_signed_in` events over time
2. **Onboarding Funnel** — Funnel: `user_signed_in` → `project_created` → `member_added`
3. **Plan Upgrades** — Trend of `plan_selected` events, broken down by `plan_name`
4. **Project Creation Rate** — Trend of `project_created` events over time
5. **Feature Engagement** — Trend of `quick_action_clicked` events, broken down by `action_label`

Visit [https://us.i.posthog.com](https://us.i.posthog.com) to set up your dashboards.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
