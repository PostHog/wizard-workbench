<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js 15 SaaS app with PostHog. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js client-side via Next.js 15's instrumentation-client convention, with a reverse proxy path (`/ingest`), exception tracking enabled, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/*` → PostHog US ingestion and `/ingest/static/*`, `/ingest/array/*` → PostHog US assets, plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton posthog-node client for server-side event capture, configured with `flushAt: 1` and `flushInterval: 0` for immediate flushing in serverless functions.
- **`app/(login)/actions.ts`**: Added server-side event capture and user identification in all auth Server Actions: `signIn`, `signUp`, `signOut`, `updatePassword`, `deleteAccount`, `updateAccount`, `removeTeamMember`, `inviteTeamMember`.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` event capture after successful Stripe checkout session handling.
- **`lib/payments/stripe.ts`**: Added `subscription_updated` event capture inside `handleSubscriptionChange` for both active/trialing and canceled/unpaid transitions.
- **`app/(dashboard)/pricing/pricing-tracker.tsx`** (new): Client component that captures `pricing_page_viewed` on mount.
- **`app/(dashboard)/pricing/page.tsx`**: Imported and rendered `<PricingTracker />` to track pricing page views.
- **`app/(dashboard)/layout.tsx`**: Added `posthog.identify()` in `UserMenu` via `useEffect` (syncs user identity when SWR loads user data), and `posthog.reset()` in `handleSignOut` after the server action completes.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user signed in to their account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `checkout_completed` | A user successfully completed the Stripe checkout and started a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription status changed via Stripe webhook. | `lib/payments/stripe.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member was removed from the team. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their account password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email. | `app/(login)/actions.ts` |
| `pricing_page_viewed` | A user viewed the pricing page, the top of the checkout conversion funnel. | `app/(dashboard)/pricing/pricing-tracker.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1777456)
- [Signup-to-paid conversion funnel](https://us.i.posthog.com/project/483112/insights/9685583)
- [Total signups over time](https://us.i.posthog.com/project/483112/insights/9685585)
- [Account churn](https://us.i.posthog.com/project/483112/insights/9685587)
- [Team growth](https://us.i.posthog.com/project/483112/insights/9685588)
- [Active users](https://us.i.posthog.com/project/483112/insights/9685590)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on sign-in; ensure returning sessions (already logged in, page refresh) also get identified via the `useEffect` in `app/(dashboard)/layout.tsx`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
