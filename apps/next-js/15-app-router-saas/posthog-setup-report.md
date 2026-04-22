<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js for client-side analytics using `instrumentation-client`, the recommended approach for Next.js 15.3+. Enables automatic exception capture and session replay.
- **`next.config.ts`**: Added reverse proxy rewrites to route PostHog requests through `/ingest/*`, reducing ad-blocker interference.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client factory using `posthog-node`. Used across all server actions and API routes.
- **`app/(login)/login.tsx`**: Added client-side `posthog.identify()` on form submit, linking the user's email to their PostHog session at sign-in and sign-up.
- **`app/(login)/actions.ts`**: Added server-side events and user identification for all key auth/account actions.
- **`lib/payments/actions.ts`**: Added server-side events when checkout is initiated and when the Stripe customer portal is opened.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` event after a Stripe subscription is successfully created.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` and `subscription_cancelled` events on Stripe webhook delivery, correlated to user email via DB lookup.
- **`app/(dashboard)/pricing/page.tsx`**: Added `pricing_page_viewed` event (top of conversion funnel) for authenticated users.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | User completes Stripe checkout; subscription created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription updated (renewal, plan change) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe subscription deleted/cancelled (churn) | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account (churn) | `app/(login)/actions.ts` |
| `account_updated` | User updates name or email | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed from a team | `app/(login)/actions.ts` |
| `customer_portal_opened` | User opens the Stripe customer portal | `lib/payments/actions.ts` |
| `pricing_page_viewed` | Authenticated user views the pricing page | `app/(dashboard)/pricing/page.tsx` |

## Next steps

To create a dashboard in PostHog with these events, log into your PostHog instance and create a new dashboard called "Analytics basics" with the following suggested insights:

1. **Signup conversion funnel** — Funnel: `pricing_page_viewed` → `checkout_started` → `checkout_completed`
2. **New signups over time** — Trend: `user_signed_up` (daily)
3. **Active users (sign-ins)** — Trend: `user_signed_in` (unique users, weekly)
4. **Churn events** — Trend: `subscription_cancelled` + `account_deleted` (combined, monthly)
5. **Team growth** — Trend: `team_member_invited` (daily)

Log in to PostHog at https://us.posthog.com to set these up using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
