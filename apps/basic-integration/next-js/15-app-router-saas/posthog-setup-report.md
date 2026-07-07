# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS starter. Changes include:

- **`instrumentation-client.ts`** (new) — Initializes posthog-js for client-side analytics using the Next.js 15.3+ instrumentation pattern. Includes error tracking (`capture_exceptions: true`) and a reverse-proxy `api_host`.
- **`next.config.ts`** — Added reverse-proxy rewrites so PostHog requests route through `/ingest/*`, avoiding ad blockers.
- **`lib/posthog-server.ts`** (new) — Singleton posthog-node client for server-side event capture with `flushAt: 1` for immediate delivery.
- **`components/posthog-identify.tsx`** (new) — Client component that identifies authenticated users via `posthog.identify()` on every page load using the SWR user cache.
- **`app/layout.tsx`** — Mounts `PostHogIdentify` inside `SWRConfig` so user identification runs globally on all pages.
- **`app/(dashboard)/layout.tsx`** — Added `posthog.reset()` in the sign-out handler to unlink the user session from future anonymous events.
- **`app/(login)/actions.ts`** — Server-side PostHog events and `posthog.identify()` calls added to `signIn`, `signUp`, `signOut`, `updatePassword`, `deleteAccount`, `inviteTeamMember`, and `removeTeamMember`.
- **`lib/payments/actions.ts`** — `checkout_started` captured in the `checkoutAction` server action when a user initiates Stripe checkout.
- **`app/api/stripe/checkout/route.ts`** — `subscription_created` captured after a successful Stripe checkout session is confirmed.
- **`app/api/stripe/webhook/route.ts`** — `subscription_updated` and `subscription_canceled` captured when Stripe subscription webhooks arrive.
- **`app/(dashboard)/pricing/page.tsx`** — `pricing_page_viewed` captured server-side for authenticated visitors at the top of the conversion funnel.

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account, optionally via an invitation link. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully authenticated and was redirected to the dashboard. | `app/(login)/actions.ts` |
| `user_signed_out` | A user explicitly signed out of their account. | `app/(login)/actions.ts` |
| `checkout_started` | A user initiated a Stripe checkout session for a subscription plan. | `lib/payments/actions.ts` |
| `subscription_created` | A Stripe checkout completed and the team's subscription was activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's Stripe subscription status changed (e.g. upgraded, downgraded, went to trial). | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A team's Stripe subscription was canceled or became unpaid. | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team owner removed a member from the team. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account after confirming their password. | `app/(login)/actions.ts` |
| `pricing_page_viewed` | A user viewed the pricing page, marking the top of the subscription conversion funnel. | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1811373)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/bMmpG4W4)
- [Subscription conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/Vhig2HAK)
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/sOjWVTiJ)
- [Subscription cancellations (wizard)](https://us.posthog.com/project/483112/insights/AW0gF5cj)
- [Team collaboration activity (wizard)](https://us.posthog.com/project/483112/insights/7wwiZncN)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component handles this on every page load via SWR, but verify it fires correctly after a hard refresh when the session cookie is present.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
