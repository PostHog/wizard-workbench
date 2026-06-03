# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js SaaS project with PostHog. The setup includes client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, a server-side PostHog client, and event tracking across all critical user flows including authentication, billing, and team management. User identification is wired up both server-side (on sign-in/sign-up/account-update) and client-side (via the dashboard layout using SWR user data), with `posthog.reset()` called on sign-out.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to an existing account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completed a Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription status changed via Stripe webhook | `lib/payments/stripe.ts` |

## Next steps

A PostHog "Analytics basics" dashboard could not be created automatically because the connected API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. You can create the dashboard manually in your PostHog project by heading to [Dashboards](/dashboards) and creating a new one called "Analytics basics" with these recommended insights:

1. **Signup funnel** — a funnel from `user_signed_up` → `checkout_started` → `checkout_completed`
2. **Active signups** — a trends chart of `user_signed_up` over time
3. **Checkout conversion** — a trends chart comparing `checkout_started` vs `checkout_completed`
4. **Subscription changes** — a trends chart of `subscription_updated` broken down by `status` property
5. **Churn risk** — a trends chart of `account_deleted` over time

To fix the scope issue and enable automated dashboard creation in future runs, update your PostHog personal API key at [/settings/user-api-keys](/settings/user-api-keys) and add the `dashboard:write`, `insight:write`, and `query:read` scopes.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
