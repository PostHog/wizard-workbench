<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using the Next.js 15.3+ instrumentation pattern. Configures PostHog with a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client singleton using `posthog-node`, used in API routes and Server Actions.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/*` → PostHog US cloud, and set `skipTrailingSlashRedirect: true` for correct API behavior.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/login.tsx`**: Added `onSubmit` handler to `posthog.identify()` the user by email and capture `user_signed_in` or `user_signed_up` client-side before the form submits.
- **`app/(login)/actions.ts`**: Added server-side PostHog events for `user_signed_in`, `user_signed_up`, `user_signed_out`, `team_member_invited`, and `team_member_removed` using `posthog-node`. Also calls `posthog.identify()` server-side to correlate user sessions.
- **`app/api/stripe/checkout/route.ts`**: Added server-side `checkout_completed` event with subscription details (plan name, Stripe IDs, status).
- **`app/api/stripe/webhook/route.ts`**: Added server-side `subscription_updated` and `subscription_cancelled` events triggered by Stripe webhooks.
- **`app/(dashboard)/dashboard/general/page.tsx`**: Added `account_updated` event capture on form submit.
- **`app/(dashboard)/dashboard/security/page.tsx`**: Added `password_updated` and `account_deleted` event captures on their respective form submits.
- **`app/(dashboard)/pricing/submit-button.tsx`**: Added `checkout_initiated` event capture when the "Get Started" button is clicked.

## Events tracked

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created an account (with or without invitation) | `app/(login)/login.tsx`, `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx`, `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked a pricing plan and started the Stripe checkout flow | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook confirmed subscription status change | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook confirmed subscription was deleted | `app/api/stripe/webhook/route.ts` |
| `account_updated` | User updated their account name or email in general settings | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User successfully changed their password in security settings | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User deleted their account from security settings | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |

## Next steps

We've set up the PostHog integration. To build insights and a dashboard in PostHog based on these events, visit your PostHog project and create an "Analytics basics" dashboard with the following suggested insights:

1. **Signup funnel**: `user_signed_up` → `checkout_initiated` → `checkout_completed` — tracks the conversion from registration to paid subscription
2. **Daily new signups**: Trend of `user_signed_up` events over time
3. **Subscription churn**: Trend of `subscription_cancelled` events over time
4. **Team growth**: Trend of `team_member_invited` events over time
5. **Account retention signals**: `password_updated` and `account_updated` as engagement indicators

You can access your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
