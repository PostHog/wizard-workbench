<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. Here's a summary of all changes made:

**PostHog service created** at `src/app/@core/services/posthog.service.ts` — an SSR-safe singleton service wrapping posthog-js with a no-op proxy for non-browser environments.

**PostHog initialized** in `src/app/app.component.ts` — the app root now calls `posthogService.init()` on startup with the project token and host read from environment variables.

**Environment files updated** — `src/environments/environment.ts` and `src/environments/environment.prod.ts` now include `posthogKey` and `posthogHost`, read via `import.meta.env` from the `.env` file at project root.

**User identification** — `posthog.identify()` is called after login in the `LoginComponent`, associating the user's `username` and `email` with their PostHog profile. On logout, `posthog.reset()` clears the identity.

**Event tracking** was added across 11 components covering user actions, settings changes, team operations, and billing activity.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User explicitly logs out | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `profile_updated` | User saves profile changes | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `two_factor_authentication_toggled` | User enables or disables 2FA | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `billing_page_viewed` | User views the billing page | `src/app/pages/billing/billing.component.ts` |
| `user_clicked` | User clicks on a user in the users list | `src/app/pages/users/list/list.component.ts` |

## Next steps

Visit your [PostHog project](https://us.i.posthog.com) to create an "Analytics basics" dashboard. Recommended insights:

1. **Login trend** — Trends insight for `user_logged_in` over the last 30 days
2. **Project creation funnel** — Funnel from `user_logged_in` → `project_created` to measure onboarding conversion
3. **Team growth** — Trends insight for `member_added` over the last 30 days
4. **Billing funnel** — Funnel from `billing_page_viewed` → plan upgrade to measure upgrade conversion
5. **Security activity** — Trends insight for `two_factor_authentication_toggled` and `session_revoked`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-angular/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
