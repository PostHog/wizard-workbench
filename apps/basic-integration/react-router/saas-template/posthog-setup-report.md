<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. The integration covers client-side initialization with the PostHog React provider and `@posthog/react` hooks, a server-side PostHog middleware that attaches a Node.js client to every request, user identification on login, session reset on logout, error boundary capture, and server-side event tracking across authentication, onboarding, organization management, billing, and account lifecycle flows.

| Event name | Description | File |
|---|---|---|
| `user_registered` | User completed registration with email or Google OAuth. | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User successfully logged in with email or Google OAuth. | `app/features/user-authentication/login/login-action.server.ts` |
| `user_logged_out` | User logged out of the application. | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_user_account_completed` | User completed the user account onboarding step by setting their name. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed the organization onboarding step by creating their first organization. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created a new organization. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `team_member_invited` | Admin invited a new team member to the organization by email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_completed` | Organization completed a Stripe checkout session and started a paid subscription. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Organization cancelled their subscription. | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form for enterprise inquiries. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `user_account_deleted` | User deleted their own account. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824627)
- **Insight**: [User registrations and logins](https://us.posthog.com/project/483112/insights/ZC1e8QwQ)
- **Insight**: [Signup to onboarding completion funnel](https://us.posthog.com/project/483112/insights/WpDimSG9)
- **Insight**: [Subscription checkouts vs cancellations](https://us.posthog.com/project/483112/insights/N3ljrdq2)
- **Insight**: [Organization and team growth](https://us.posthog.com/project/483112/insights/eJldgUXy)
- **Insight**: [Churn signals: logouts and account deletions](https://us.posthog.com/project/483112/insights/1ShATEJx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on login; verify that users who refresh the page while already logged in are also identified (the authenticated routes layout now calls `identify` on mount, which covers this case, but confirm it works end-to-end in your environment).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
