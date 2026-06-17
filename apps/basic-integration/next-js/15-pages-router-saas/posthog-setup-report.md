# PostHog Setup Report

PostHog product analytics, event capture, user identification, and error tracking are now integrated into this Next.js 15 Pages Router SaaS app.

---

## Installation

| Package | Version |
|---|---|
| `posthog-js` (client-side) | 1.387.0 |
| `posthog-node` (server-side) | 5.38.0 |

Installed via `pnpm install --no-frozen-lockfile`.

---

## Initialization

**Client-side** — `pages/_app.tsx`

PostHog initializes once on mount via a `useEffect` hook with exception autocapture enabled:

```ts
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  capture_exceptions: true,
});
```

**Server-side** — `lib/posthog.ts`

A `getPostHogClient()` helper returns a fresh `PostHog` (posthog-node) instance for use in API routes. Each route calls `await posthog.shutdown()` after capture to flush events before the serverless function exits.

**Environment variables** set in `.env`:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

---

## Events Instrumented

13 events are captured across auth, billing, and team management flows.

| Event | What it measures | File |
|---|---|---|
| `user_signed_up` | New account created | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Successful email/password login | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | User signed out | `components/header.tsx` |
| `checkout_session_created` | Stripe checkout session started for a plan | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | User returned from Stripe after successful payment | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Team subscription changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Team subscription cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Team owner invited a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member | `pages/api/team/remove-member.ts` |
| `account_updated` | User changed their name or email | `pages/api/account/update.ts` |
| `manage_subscription_clicked` | User clicked Manage Subscription in dashboard | `pages/dashboard/index.tsx` |
| `pricing_plan_selected` | User clicked Get Started on a pricing card | `pages/pricing.tsx` |

---

## User Identification

**Wired.** `posthog.identify()` is called in `components/login.tsx` after a successful sign-in or sign-up response. The numeric user ID (converted to string) is used as the `distinct_id`, with `email` and `name` as person properties.

`posthog.reset()` is called in `components/header.tsx` immediately after the sign-out API call succeeds, before cache clearing and redirect — this ensures the anonymous user is cleanly separated from the logged-in session.

---

## Error Tracking

Client-side exception autocapture is enabled via `capture_exceptions: true` in the `posthog.init()` call (`pages/_app.tsx`). This hooks into `window.onerror` and `window.onunhandledrejection`, forwarding all uncaught client-side exceptions to PostHog as `$exception` events.

---

## Dashboard

No PostHog dashboard was created as part of this run. You can build one manually in PostHog using the events listed above — the auth funnel (`user_signed_up` → `checkout_completed`) and revenue events (`subscription_updated`, `subscription_cancelled`) are good starting points.

[Open PostHog](https://us.posthog.com/project/2)

---

## Build

TypeScript compiled cleanly (`✓ Compiled successfully in 7.5s`). One fix was applied during the build step: the error-tracking agent used `enable_exception_autocapture: true` (not a valid `PostHogConfig` key); this was corrected to `capture_exceptions: true` in `pages/_app.tsx`.

**Known conflict — pre-existing, unrelated to PostHog:**

```
Error: POSTGRES_URL environment variable is not set
```

The build fails at the "Collecting page data" stage because the dashboard page makes a database call at build time and no `POSTGRES_URL` is set in the CI environment. This is a pre-existing infrastructure issue. PostHog code is not involved.

---

## Next Steps

1. **Set env vars in production** — ensure `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are set in your deployment environment (Vercel, Railway, etc.).
2. **Fix the build environment** — set `POSTGRES_URL` (and any other required DB vars) in CI so `pnpm build` completes fully.
3. **Verify events in PostHog** — sign up, sign in, and complete a checkout in a staging environment, then confirm events appear in the [PostHog Live Events view](https://us.posthog.com/project/2/activity/explore).
4. **Build a dashboard** — use `user_signed_up`, `checkout_completed`, `subscription_updated`, and `subscription_cancelled` to track your conversion funnel and revenue health.
5. **Add server-side error tracking** (optional) — consider wrapping API route handlers with try/catch blocks that call `posthog.captureException()` for server-side error visibility.
