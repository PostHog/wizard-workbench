# PostHog Setup Report

PostHog product analytics, user identification, and error tracking have been added to this Next.js 15 App Router SaaS starter.

---

## What was installed

| Package | Version declared | Version installed |
|---|---|---|
| `posthog-js` | `^1.187.0` | `1.387.0` |
| `posthog-node` | `^5.31.0` | `5.38.0` |

Environment variables written to `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

---

## Initialization

**Client-side** — `lib/providers/posthog-provider.tsx` initializes `posthog-js` once on mount with `person_profiles: 'always'`. The provider wraps the entire app in `app/layout.tsx`.

**Server-side** — `lib/posthog.ts` exports `createServerPostHog()`, which instantiates a `posthog-node` client with `flushAt: 1` / `flushInterval: 0` so every server event is flushed immediately (no batching). Server actions call `posthog.flush()` after capturing.

---

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | User authenticated with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | New account created | `app/(login)/actions.ts` |
| `invitation_accepted` | New user joined via team invitation | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated account name or email | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation | `app/(login)/actions.ts` |
| `checkout_started` | User initiated Stripe checkout | `lib/payments/actions.ts` |
| `customer_portal_accessed` | User opened Stripe customer portal | `lib/payments/actions.ts` |
| `checkout_completed` | Stripe checkout succeeded, subscription created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription became active or entered trial | `lib/payments/stripe.ts` |
| `subscription_canceled` | Subscription canceled or became unpaid | `lib/payments/stripe.ts` |

---

## User identification

**Wired.** `app/(dashboard)/layout.tsx` calls `posthog.identify()` in a `useEffect` that runs whenever the authenticated user object loads. It passes the user's numeric `id` as the distinct ID, along with `email` and `name` as person properties. `posthog.reset()` is called on sign-out to clear the anonymous profile.

---

## Error tracking

**Added.** `app/global-error.tsx` is a new file that catches unhandled React rendering errors at the root level and calls `posthog.captureException(error)` so they appear in PostHog's Error Tracking view.

---

## Dashboard

No new dashboard was created during this run. You can explore your events in PostHog at:

[PostHog Project — Events](https://us.posthog.com/project/2/events)

A ready-made template that fits this SaaS pattern is **"B2B SaaS Product Metrics"** — you can find it in the [PostHog dashboard templates](https://us.posthog.com/project/2/dashboard) or use the one already in your project at [dashboard/229221](https://us.posthog.com/project/2/dashboard/229221).

---

## Build conflict

The integration completed type-checking and compiled successfully, but the Next.js build failed at the **"Collecting page data"** phase with:

```
Error: POSTGRES_URL environment variable is not set
```

This is a **pre-existing environment issue** — the project requires a live Postgres connection at build time and none is available in this CI environment. It is unrelated to the PostHog integration. In addition, `posthog-node` 5.38.0 removed the `shutdownAsync()` method; the integration automatically updated all 13 call sites across four files to use `flush()` instead.

**Files patched:**
- `app/(login)/actions.ts`
- `app/api/stripe/checkout/route.ts`
- `lib/payments/actions.ts`
- `lib/payments/stripe.ts`

---

## Next steps

1. **Set `POSTGRES_URL`** in your production environment (and locally) so the app and Next.js build complete successfully.
2. **Verify events are flowing** — sign in, sign up, and complete a checkout in your local dev environment, then check [PostHog Live Events](https://us.posthog.com/project/2/events) to confirm events arrive.
3. **Review person profiles** — after a few sign-ins, open [Persons](https://us.posthog.com/project/2/persons) to confirm `email` and `name` are being set correctly.
4. **Check Error Tracking** — visit [Error Tracking](https://us.posthog.com/project/2/error_tracking) to confirm exceptions from `global-error.tsx` are captured.
5. **Build a dashboard** — use the "B2B SaaS Product Metrics" template or create custom insights around the 14 events above to track signups, subscription conversions, and churn.
