# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initialises `posthog-js` on the client using Next.js 15.3+'s `instrumentation-client` convention. Includes a reverse-proxy `api_host`, exception autocapture, and debug mode in development.
- **`next.config.ts`**: Added `/ingest/*` rewrites to route PostHog requests through the app's own domain, avoiding ad blockers.
- **`lib/posthog-server.ts`** (new): Singleton `getPostHogClient()` function that returns a `posthog-node` instance configured for short-lived Next.js server contexts (`flushAt: 1`, `flushInterval: 0`).
- **`components/posthog-identify.tsx`** (new): Client component that reads the current user from SWR (`/api/user`) and calls `posthog.identify()` on mount, ensuring returning sessions are linked to the correct person.
- **`app/layout.tsx`**: Mounts `<PostHogIdentify />` inside the SWR provider so identification happens on every page load when a session is present.
- **`app/(login)/actions.ts`**: Added server-side `posthog.identify()` + `posthog.capture()` calls to all auth and account actions.
- **`app/(dashboard)/layout.tsx`**: Calls `posthog.reset()` in `handleSignOut` so the browser session is unlinked from the user on logout.
- **`lib/payments/actions.ts`**: Added `checkout_started` and `customer_portal_opened` events to the respective server actions.
- **`app/api/stripe/checkout/route.ts`**: Captures `subscription_created` with plan and subscription details after a successful Stripe checkout.
- **`app/api/stripe/webhook/route.ts`**: Captures `subscription_updated` or `subscription_canceled` depending on the incoming Stripe event status.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `sign_up` | User successfully creates a new account. | `app/(login)/actions.ts` |
| `sign_in` | User successfully signs in to their account. | `app/(login)/actions.ts` |
| `sign_out` | User signs out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | User initiates the Stripe checkout flow from the pricing page. | `lib/payments/actions.ts` |
| `subscription_created` | User completes checkout and a subscription is created successfully. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | An existing subscription is updated via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A subscription is canceled via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | User opens the Stripe customer portal to manage their subscription. | `lib/payments/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password. | `app/(login)/actions.ts` |
| `account_updated` | User updates their account information such as name or email. | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829241)
- [New sign-ups over time](https://us.posthog.com/project/483112/insights/CRdpzPSa) — daily `sign_up` trend over 30 days
- [Checkout to subscription funnel](https://us.posthog.com/project/483112/insights/Ao0zN2kL) — `checkout_started` → `subscription_created` conversion (7-day window)
- [Subscription cancellations](https://us.posthog.com/project/483112/insights/QCYmYj9f) — weekly `subscription_canceled` bar chart over 90 days
- [Sign-up to paid funnel](https://us.posthog.com/project/483112/insights/zp2zuIRB) — `sign_up` → `subscription_created` conversion (14-day window)
- [Team growth: invitations sent](https://us.posthog.com/project/483112/insights/e9vWEkIF) — weekly `team_member_invited` vs `team_member_removed`

Dashboard subscription and alerts were not created (no consent provided).

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component handles this on every page load, but verify it fires correctly after a page refresh when the user is already logged in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
