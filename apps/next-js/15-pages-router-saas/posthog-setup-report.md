<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS project. Both client-side and server-side tracking have been instrumented, covering the full user lifecycle from sign-up through subscription management and team collaboration.

**Changes made:**

- **`instrumentation-client.ts`** *(new)* — Initializes `posthog-js` for client-side tracking using Next.js 15's built-in instrumentation hook. Configured with a reverse proxy (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`** — Added reverse proxy rewrites so PostHog requests are routed through the app, improving reliability against ad blockers.
- **`lib/posthog-server.ts`** *(new)* — Singleton helper for the `posthog-node` server-side client, used in API routes.
- **`components/login.tsx`** — Added `posthog.identify()` and capture of `user_signed_in` / `user_signed_up` after successful authentication, plus `posthog.captureException()` on errors.
- **`pages/pricing.tsx`** — Added `checkout_initiated` capture with plan name and price ID when a user clicks "Get Started".
- **`pages/dashboard/general.tsx`** — Added `account_info_updated` capture with name/email properties after a successful settings save, plus exception tracking.
- **`pages/api/team/invite.ts`** — Added server-side `team_member_invited` capture after an invitation is successfully sent.
- **`pages/api/team/remove-member.ts`** — Added server-side `team_member_removed` capture after a team member is removed.
- **`pages/api/stripe/create-checkout.ts`** — Added server-side `checkout_session_created` capture after a Stripe session is created.
- **`pages/api/stripe/webhook.ts`** — Added server-side `subscription_updated` and `subscription_cancelled` captures when Stripe subscription webhooks are received.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in to their account | `components/login.tsx` |
| `user_signed_up` | User successfully created a new account | `components/login.tsx` |
| `checkout_initiated` | User clicked 'Get Started' to begin checkout from the pricing page | `pages/pricing.tsx` |
| `account_info_updated` | User saved changes to their account name or email | `pages/dashboard/general.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `checkout_session_created` | Stripe checkout session successfully created for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | User's subscription status changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | User's subscription was deleted/cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |

## Next steps

Visit your PostHog project to explore the data and build insights:

- **Project overview**: https://us.posthog.com/project/238460
- **Create a new "Analytics basics" dashboard**: https://us.posthog.com/project/238460/dashboard/new
- **Build a sign-up → checkout conversion funnel**: https://us.posthog.com/project/238460/insights/new#funnel
- **Track active users over time**: https://us.posthog.com/project/238460/insights/new#trends

Suggested insights for your "Analytics basics" dashboard:

1. **Sign-up trend** — Trend of `user_signed_up` over time to monitor growth
2. **Sign-in → checkout funnel** — Conversion funnel: `user_signed_in` → `checkout_initiated` → `checkout_session_created`
3. **Subscription churn** — Trend of `subscription_cancelled` events over time
4. **Team collaboration activity** — Trend of `team_member_invited` and `team_member_removed` events
5. **Account engagement** — Trend of `account_info_updated` to measure active users

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
