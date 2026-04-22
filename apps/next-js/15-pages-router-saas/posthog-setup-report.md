<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using the `instrumentation-client` pattern for Next.js 15.3+. Enables autocapture, session replay, and error tracking via `capture_exceptions: true`.
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/*`) to route analytics traffic through the app, reducing tracking blockers.
- **`lib/posthog-server.ts`** (new) — Singleton server-side PostHog client (`posthog-node`) shared across all API routes.
- **`components/login.tsx`** — After successful sign-in or sign-up, calls `posthog.identify()` with the user's email, captures the appropriate event, and passes `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to the API to correlate client and server sessions. Also calls `posthog.captureException()` on errors.
- **`components/header.tsx`** — In `handleSignOut`, captures `user_signed_out` and calls `posthog.reset()` to unlink the device from the user session.
- **`pages/pricing.tsx`** — Captures `checkout_started` with plan name, price ID, and interval when a user clicks "Get Started".
- **`pages/api/auth/sign-in.ts`** — Server-side `user_signed_in` capture with `posthog.identify()`, using user email as distinct ID and linking to the anonymous client ID via `$anon_distinct_id`.
- **`pages/api/auth/sign-up.ts`** — Server-side `user_signed_up` capture with `posthog.identify()`, including whether the signup was via invitation.
- **`pages/api/stripe/webhook.ts`** — Server-side `subscription_updated` and `subscription_cancelled` captures triggered by Stripe webhook events.
- **`pages/api/stripe/customer-portal.ts`** — Server-side `customer_portal_accessed` capture when a user opens the Stripe billing portal.
- **`pages/api/team/invite.ts`** — Server-side `team_member_invited` capture with invited email and role.
- **`pages/api/team/remove-member.ts`** — Server-side `team_member_removed` capture.
- **`pages/api/account/update.ts`** — Server-side `account_updated` capture when a user saves changes to their profile.
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated a Stripe checkout session for a plan | `pages/pricing.tsx` |
| `subscription_updated` | Stripe subscription was updated (plan change or renewal) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled/deleted | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | User opened the Stripe customer billing portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account name or email | `pages/api/account/update.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights to monitor user behavior:

1. **Signup to checkout funnel** — Funnel: `user_signed_up` → `checkout_started` → `subscription_updated` (status = active). Tracks your core conversion rate.
2. **New signups over time** — Trend: `user_signed_up` per day/week. Your top-of-funnel growth metric.
3. **Subscription cancellations** — Trend: `subscription_cancelled` per week. Key churn signal.
4. **Team growth** — Trend: `team_member_invited` per week. Indicates product-led growth / viral loops.
5. **Checkout started** — Trend: `checkout_started` broken down by `plan`. Shows which plan is most popular.

Visit your PostHog project to create these: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
