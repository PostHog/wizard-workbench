<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS project. Here's a summary of every change made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side via the Next.js instrumentation hook. Uses a reverse proxy (`/ingest`) to improve reliability and enables automatic exception capture.
- **`next.config.ts`**: Added reverse proxy rewrites so all PostHog requests route through your own domain (`/ingest/*`), reducing tracking-blocker interference.
- **`lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node` with immediate-flush settings (`flushAt: 1`, `flushInterval: 0`) for short-lived server functions.
- **`.env.local`**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(dashboard)/layout.tsx`**: Added `posthog.identify()` when user data loads (syncing known user to PostHog) and `posthog.capture('user_signed_out')` + `posthog.reset()` when the user signs out.
- **`app/(dashboard)/pricing/submit-button.tsx`**: Added `posthog.capture('checkout_started')` with `price_id` property when the checkout button is clicked.
- **`app/(login)/actions.ts`**: Added server-side PostHog captures (with user identification) to 7 server actions: `signIn`, `signUp`, `updatePassword`, `deleteAccount`, `updateAccount`, `removeTeamMember`, and `inviteTeamMember`.
- **`app/api/stripe/checkout/route.ts`**: Captures `subscription_checkout_completed` with plan name, product ID, and subscription ID after a successful Stripe checkout.
- **`app/api/stripe/webhook/route.ts`**: Captures `subscription_updated` and `subscription_canceled` from Stripe webhook events, including subscription status.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in | `app/(login)/actions.ts` |
| `user_signed_up` | User creates a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User clicks checkout for a plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | Stripe checkout completed and subscription created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription status changed | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe subscription deleted or unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | User invites a team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removes a team member | `app/(login)/actions.ts` |
| `account_updated` | User updates account name or email | `app/(login)/actions.ts` |
| `password_updated` | User changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account | `app/(login)/actions.ts` |

## Next steps

The PostHog personal API key currently lacks `insight:write` and `dashboard:write` scopes, so the automated dashboard could not be created. To set up the recommended **"Analytics basics"** dashboard manually, create the following insights in [PostHog](/insights):

1. **Signup → Checkout → Subscription funnel** — Funnel insight with steps: `user_signed_up` → `checkout_started` → `subscription_checkout_completed`. Shows your conversion rate from registration to paying customer.

2. **Daily signups and sign-ins** — Trends insight with two series: `user_signed_up` and `user_signed_in`, broken down by day. Tracks user acquisition and engagement over time.

3. **Subscription changes** — Trends insight with two series: `subscription_updated` and `subscription_canceled`. Monitors subscription health and churn signals.

4. **Team collaboration activity** — Trends insight with `team_member_invited` and `team_member_removed`. Shows team growth and churn within accounts.

5. **Account deletions** — Trends insight for `account_deleted`. A critical churn metric to watch closely.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
