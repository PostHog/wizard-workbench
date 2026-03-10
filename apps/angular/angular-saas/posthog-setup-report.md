<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Angular SaaS application. A singleton `PosthogService` was created using Angular's `inject()` pattern and initialized outside the Angular zone to avoid performance issues with session recording. PostHog is initialized in `AppComponent.ngOnInit()` using environment variables, with SSR safety via `isPlatformBrowser()`. Ten key user actions are now instrumented across authentication, project management, team collaboration, billing, and settings flows. User identity is linked on login via `posthog.identify()` and cleared on logout via `posthog.reset()`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in to the application | `src/app/auth/login/login.component.ts` |
| `user_logged_out` | User logs out of the application | `src/app/auth/logout/logout.component.ts` |
| `project_created` | User creates a new project | `src/app/shared/components/create-project-modal/create-project-modal.component.ts` |
| `member_added` | User adds a new team member | `src/app/shared/components/add-member-modal/add-member-modal.component.ts` |
| `plan_selected` | User selects or changes a billing plan | `src/app/pages/billing/billing.component.ts` |
| `account_settings_saved` | User saves their account settings | `src/app/pages/settings/components/account-settings/account-settings.component.ts` |
| `profile_updated` | User updates their profile information | `src/app/pages/profile/profile.component.ts` |
| `two_factor_auth_toggled` | User enables or disables two-factor authentication | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `session_revoked` | User revokes an active session | `src/app/pages/settings/components/security-settings/security-settings.component.ts` |
| `notification_preferences_saved` | User saves their notification preferences | `src/app/pages/settings/components/notification-settings/notification-settings.component.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1346340)
- [Signup to Paid Conversion Funnel](https://us.posthog.com/project/2/insights/YpKWr8CW)
- [New Signups & Daily Active Users](https://us.posthog.com/project/2/insights/gSx6tbeo)
- [Churn Signals: Account Deletions & Cancellations](https://us.posthog.com/project/2/insights/qmhtoiwP)
- [Revenue: New Subscriptions & Activations](https://us.posthog.com/project/2/insights/i1Il3Pil)
- [Team Growth: Invitations & Removals](https://us.posthog.com/project/2/insights/F8xFXViT)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
