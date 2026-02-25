# PostHog post-wizard report

The wizard has completed a deep integration of your project. Two new files were created — `instrumentation-client.ts` for client-side PostHog initialisation (using the Next.js 15.3+ instrumentation API, no Provider component required) and `lib/posthog-server.ts` for a server-side PostHog singleton using `posthog-node`. A reverse proxy was added in `next.config.ts` so analytics requests are routed through your own domain via `/ingest`, reducing ad-blocker interference. Environment variables `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` were written to `.env.local`. Eleven business-critical events were instrumented across authentication, payments, and team management — all server-side events use `posthog-node` directly inside Server Actions and API routes, while client-side user identification is handled in the login form's `onSubmit` handler. `posthog.reset()` is called on sign-out to clear the local PostHog state. One planned event (`pricing_page_viewed`) was intentionally omitted from server-side code because the pricing page uses `revalidate = 3600` static caching — calling `cookies()` inside it would have forced the route to become dynamic and broken Stripe price caching. Automatic `$pageview` capture by `posthog-js` covers that page instead.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account, with or without an invitation | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired when a user signs out of their account | `app/(login)/actions.ts` |
| `pricing_page_viewed` | Fired when a user views the pricing page — top of the subscription conversion funnel | `app/(dashboard)/pricing/page.tsx` *(captured automatically via `$pageview`)* |
| `checkout_started` | Fired when a user clicks 'Get Started' and initiates a Stripe checkout session | `lib/payments/actions.ts` |
| `checkout_completed` | Fired server-side when Stripe redirects back after a successful checkout and the subscription is saved to the database | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired server-side via Stripe webhook when a subscription status changes (updated or deleted) | `app/api/stripe/webhook/route.ts` |
| `account_updated` | Fired when a user saves changes to their name or email in General Settings | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password in Security Settings | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user soft-deletes their account from Security Settings — high-value churn signal | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team owner removes a member from the team | `app/(login)/actions.ts` |

## Next steps

We've prepared the following starting points in your PostHog project. You can build insights and a dashboard directly in the PostHog UI using the events listed above:

- [PostHog Project — Activity feed](https://us.posthog.com/project/238460/activity/explore)
- [PostHog Project — Create new dashboard](https://us.posthog.com/project/238460/dashboard)
- [PostHog Project — Create new insight (Funnel)](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

**Recommended insights to build:**

1. **Signup conversion funnel** — `pricing_page_viewed` → `checkout_started` → `checkout_completed` → `user_signed_up`
2. **Auth funnel** — `user_signed_up` → `user_signed_in` (cohort over time)
3. **Churn signal** — `account_deleted` trend over time, broken down by plan
4. **Team growth** — `team_member_invited` and `team_member_removed` trends
5. **Subscription health** — `subscription_updated` filtered by `subscription_status` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
