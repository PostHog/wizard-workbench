<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS application. The integration covers:

- **Client-side initialization** via `instrumentation-client.ts` using Next.js 15.3+'s native file convention, with automatic pageview tracking, session replay, and exception capture enabled.
- **Reverse proxy** added to `next.config.ts` so PostHog requests are routed through your domain (`/ingest/...`), reducing the chance of ad-blockers interfering.
- **Server-side PostHog client** at `lib/posthog-server.ts` using `posthog-node` for tracking events from Server Actions and API routes.
- **User identification** on both client (via `posthog.identify()` in `app/(dashboard)/layout.tsx` when the user data loads from SWR) and server (via `posthog.identify()` in the `signIn`/`signUp` Server Actions).
- **Session reset** on sign-out via `posthog.reset()` in the sign-out handler.
- **10 custom events** across authentication, billing, and team management flows.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New user created an account (with or without invitation) | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_completed` | User completed Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Stripe webhook fired for subscription update or cancellation | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

Visit your PostHog project to explore the data from these events. We recommend building the following insights to keep an eye on your key business metrics:

- **Signup conversion funnel**: `pricing_page_viewed` → `user_signed_up` → `checkout_completed` — tracks how many users go from seeing pricing to subscribing.
- **Daily active signups**: Trend chart of `user_signed_up` over time — monitors user acquisition.
- **Churn indicators**: Trend of `account_deleted` and `subscription_changed` (where status = canceled) — early warning for churn.
- **Authentication activity**: Trend of `user_signed_in` vs `user_signed_up` — shows returning vs. new user engagement.
- **Team growth**: Trend of `team_member_invited` — signals team expansion and potential expansion revenue.

Use these links to get started in PostHog:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Create a new Funnel insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)
- [Create a new Trend insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
