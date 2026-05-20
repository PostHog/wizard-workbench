<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for this Angular 21 SaaS application. Here is a summary of all changes made:

- **Installed** `posthog-js` via npm
- **Created** `src/app/services/posthog.service.ts` — a singleton Angular service that initialises the PostHog SDK outside the Angular zone (using `NgZone.runOutsideAngular`) to avoid change-detection performance issues, with SSR-safe platform checks
- **Created** `src/env.d.ts` — TypeScript declarations for `import.meta.env` to support `NG_APP_*` environment variables
- **Updated** `src/environments/environment.ts` and `src/environments/environment.prod.ts` — added `posthogKey` and `posthogHost` fields sourced from `NG_APP_POSTHOG_KEY` / `NG_APP_POSTHOG_HOST` environment variables
- **Updated** `src/app/app.component.ts` — injected `PosthogService` to ensure the SDK is initialised at application startup
- **Set up** `.env` file with `NG_APP_POSTHOG_KEY` and `NG_APP_POSTHOG_HOST`
- **Added event tracking** across 8 component files (see table below)

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in; also calls `posthog.identify()` to link the session to the user | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | Fired when a user logs out; also calls `posthog.reset()` to clear the session | `src/app/auth/logout/logout.component.ts` |
| `project_created` | Fired when a user successfully creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | Fired when a user successfully adds a team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `subscription_plan_viewed` | Fired when a user views the billing/subscription plans page (top of upgrade funnel) | `src/app/pages/billing/billing.component.ts` |
| `subscription_upgrade_clicked` | Fired when a user clicks to upgrade their subscription plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | Fired when a user saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `two_factor_auth_toggled` | Fired when a user enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `profile_updated` | Fired when a user saves their profile changes | `src/app/pages/profile/profile.component.ts` |
| `quick_action_clicked` | Fired when a user clicks a quick action on the dashboard | `src/app/pages/dashboard/components/quick-actions/quick-actions.component.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Login trend** — Trends insight on `user_logged_in` over time. Gives you daily/weekly active user counts.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_logged_in","name":"user_logged_in","type":"events"}]})

2. **Upgrade funnel** — Funnel insight: `subscription_plan_viewed` → `subscription_upgrade_clicked`. Shows conversion rate from viewing plans to clicking upgrade.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"subscription_plan_viewed","type":"events"},{"id":"subscription_upgrade_clicked","type":"events"}]})

3. **Project creation rate** — Trends insight on `project_created` over time. Tracks activation and product usage depth.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"project_created","name":"project_created","type":"events"}]})

4. **Team growth** — Trends insight on `team_member_added` over time. Indicates viral/expansion growth.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"team_member_added","name":"team_member_added","type":"events"}]})

5. **Security engagement** — Trends insight on `two_factor_auth_toggled` broken down by the `enabled` property. Tracks security feature adoption.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"two_factor_auth_toggled","name":"two_factor_auth_toggled","type":"events"}]})

→ [New dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
