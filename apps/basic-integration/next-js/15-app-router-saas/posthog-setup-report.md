<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application.

## What was done

- **Client-side initialization** (`instrumentation-client.ts`): PostHog is initialized via the `instrumentation-client.ts` convention for Next.js 15.3+, with a reverse proxy through `/ingest`, automatic exception capture, and debug mode in development.
- **Reverse proxy** (`next.config.ts`): Added rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog requests through the app's own domain, reducing ad-blocker interference.
- **Server-side client** (`lib/posthog-server.ts`): Created a `getPostHogClient()` factory (using `posthog-node`) with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately from server functions.
- **User identification** (`app/(dashboard)/layout.tsx`): `posthog.identify()` is called client-side whenever user data loads from SWR, linking the anonymous browser session to the authenticated user. `posthog.reset()` is called on sign-out.
- **Server-side events** (`app/(login)/actions.ts`, `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`): 13 events are captured at critical business moments across both auth and payments flows.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in | `app/(login)/actions.ts` |
| `user_signed_up` | User created a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `invitation_accepted` | User signed up via team invitation | `app/(login)/actions.ts` |
| `account_updated` | User updated their name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User soft-deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | Owner invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Owner removed a team member | `app/(login)/actions.ts` |
| `checkout_completed` | Stripe checkout completed, subscription activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription updated | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted | `app/api/stripe/webhook/route.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup funnel** — Funnel insight: `user_signed_up` → `checkout_completed`. Shows the conversion rate from new users to paying customers.
2. **New signups over time** — Trend insight on `user_signed_up`. Tracks growth rate day over day.
3. **Subscription cancellations** — Trend insight on `subscription_cancelled`. Monitor churn signals.
4. **Checkout conversion** — Trend insight comparing unique users who triggered `user_signed_up` vs `checkout_completed` in the same period.
5. **Team growth** — Trend insight on `team_member_invited`. Shows team expansion and product-led growth signals.

Visit your PostHog project to build these:

- **PostHog project**: https://us.posthog.com/project/2
- **Create a new dashboard**: https://us.posthog.com/project/2/dashboard
- **New funnel insight (signup → checkout)**: https://us.posthog.com/project/2/insights/new#insight=FUNNELS
- **New trend insight**: https://us.posthog.com/project/2/insights/new#insight=TRENDS
- **Live event stream**: https://us.posthog.com/project/2/events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
