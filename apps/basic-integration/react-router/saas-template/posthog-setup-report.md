<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 SaaS template. PostHog is initialized on the client via `entry.client.tsx` with the `PostHogProvider`, and a server-side middleware in `app/lib/posthog-middleware.ts` propagates session context to all route handlers. User identification happens automatically in the authenticated sidebar layout using the logged-in user's email. Error tracking is wired into the root `ErrorBoundary`. Twelve business events are now tracked across the full funnel—from authentication through onboarding, team growth, and billing lifecycle.

| Event | Description | File |
|---|---|---|
| `login_submitted` | User submits the login form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `register_submitted` | User submits the registration form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_signed_up` | New user account created after OAuth/magic-link callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Returning user authenticates successfully | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_completed` | User creates their first organization during onboarding | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Authenticated user creates an additional organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `team_member_invited` | Admin/owner sends an email invitation to a new team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | User initiates a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe webhook confirms payment received | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_cancelled` | User cancels their subscription via billing settings | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription scheduled to cancel | `app/features/billing/billing-action.server.ts` |
| `subscription_deleted` | Stripe webhook confirms subscription permanently deleted | `app/routes/api+/v1+/stripe.webhooks.ts` |

## Next steps

We recommend building the **"Analytics basics (wizard)"** dashboard in PostHog with these five insights:

1. **Signup → Onboarding → Subscription funnel** — `register_submitted` → `user_signed_up` → `onboarding_completed` → `subscription_checkout_completed`
2. **Daily active users (logins)** — trend of `user_logged_in` over time
3. **Subscription checkout conversion** — trend of `subscription_checkout_started` vs `subscription_checkout_completed`
4. **Churn rate** — trend of `subscription_cancelled` and `subscription_deleted` over time
5. **Team growth** — trend of `team_member_invited` per organization

Create the dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

Create new insights here: [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

> **Note:** Dashboard creation via MCP was skipped because the current API key is missing `dashboard:write` and `insight:write` scopes. Add these scopes to your PostHog personal API key to enable automated dashboard creation in future wizard runs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
