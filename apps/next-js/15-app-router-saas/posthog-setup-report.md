<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 SaaS application. Here's a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` client-side using the Next.js 15.3+ instrumentation hook. Includes automatic exception capture and a reverse proxy path (`/ingest`).
- `lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event capture in Server Actions and API routes.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites to route PostHog traffic through `/ingest`, reducing ad-blocker interference.
- `app/(login)/login.tsx` — Added `posthog.identify()` on form submit to link the client-side anonymous session to the user's email before the server action redirects.
- `app/(login)/actions.ts` — Added server-side PostHog events for all auth and team management actions.
- `app/api/stripe/checkout/route.ts` — Added `checkout_initiated` event after a successful Stripe checkout session.
- `app/api/stripe/webhook/route.ts` — Added `subscription_updated` and `subscription_cancelled` events from Stripe webhook handlers.

**Environment variables set in `.env.local`:**
- `NEXT_PUBLIC_POSTHOG_KEY` — your PostHog project token
- `NEXT_PUBLIC_POSTHOG_HOST` — `https://us.i.posthog.com`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `app/(login)/actions.ts` |
| `user_signed_up` | User created a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `invitation_accepted` | User signed up via team invitation | `app/(login)/actions.ts` |
| `account_updated` | User updated their name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn) | `app/(login)/actions.ts` |
| `team_member_invited` | Owner invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team member was removed | `app/(login)/actions.ts` |
| `checkout_initiated` | Successful Stripe checkout completed | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription changed via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription cancelled via webhook | `app/api/stripe/webhook/route.ts` |

---

## Next steps

Create an **"Analytics basics"** dashboard in PostHog at https://us.posthog.com/project/2/dashboard with these suggested insights:

1. **Signup funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `subscription_updated` (status = active). Shows conversion from signup to paid.

2. **Daily active signups** — Trend of `user_signed_up` over time. Track growth.

3. **Churn rate** — Trend of `account_deleted` and `subscription_cancelled` events. Monitor churn.

4. **Team collaboration** — Trend of `team_member_invited` and `team_member_removed` per day. See engagement with team features.

5. **Authentication activity** — Bar chart comparing `user_signed_in` vs `user_signed_up` over time.

Visit https://us.posthog.com/project/2 to create your dashboard and add these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
