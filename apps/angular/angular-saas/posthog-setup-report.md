<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Angular SaaS application. A new `PostHogService` singleton was created to wrap the PostHog SDK with SSR safety. PostHog is initialized in the root `AppComponent` using environment variables. User identification is performed on login. Twelve events were added across nine files, covering the full user lifecycle: authentication, project management, team collaboration, billing engagement, and settings configuration. Error tracking is included on the login failure path.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in to the application | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `team_member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `billing_plan_viewed` | User views the billing/pricing page (top of conversion funnel) | `src/app/pages/billing/billing.component.ts` |
| `profile_updated` | User saves their profile information | `src/app/pages/profile/profile.component.ts` |
| `account_settings_saved` | User saves account settings (profile info or password change) | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `security_2fa_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |
| `create_project_modal_opened` | User opens the create project modal from the dashboard | `src/app/pages/dashboard/dashboard.component.ts` |
| `add_member_modal_opened` | User opens the add team member modal from the dashboard | `src/app/pages/dashboard/dashboard.component.ts` |

## Next steps

We've designed an **"Analytics basics"** dashboard for you to create in PostHog at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard). Create it with the following 5 insights:

1. **Login Trend** — Trends insight for `user_logged_in` over time. Shows daily active user logins.
   - [Create at PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"user_logged_in","type":"events","order":0}])

2. **Project Creation Funnel** — Funnel from `create_project_modal_opened` → `project_created`. Measures conversion rate from intent to completion.
   - [Create at PostHog](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

3. **Team Growth** — Trends insight for `team_member_added` over time. Tracks team expansion velocity.
   - [Create at PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"team_member_added","type":"events","order":0}])

4. **Billing Page Engagement** — Trends insight for `billing_plan_viewed`. Monitors user interest in plan upgrades.
   - [Create at PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"billing_plan_viewed","type":"events","order":0}])

5. **Churn Signal: Logout Rate** — Trends insight for `user_logged_out`. Useful for monitoring unusual drop-off.
   - [Create at PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"user_logged_out","type":"events","order":0}])

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
