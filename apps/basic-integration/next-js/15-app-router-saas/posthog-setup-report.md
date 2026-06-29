<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and server-side via a shared `lib/posthog-server.ts` singleton using `posthog-node`. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing ad-blocker interference. User identification is performed both server-side (on sign-in/sign-up) and client-side (in the dashboard layout when user data loads), with `posthog.reset()` called on sign-out to unlink the session.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_up` | User registered a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account name or email address | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a subscription checkout session | `lib/payments/actions.ts` |
| `subscription_checkout_completed` | Stripe checkout session completed and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription plan or status was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription was cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1775128)
- **Conversion Funnel** (Pricing → Checkout → Subscription): https://us.posthog.com/project/483112/insights/xLgr2kxz
- **Sign-up Trend**: https://us.posthog.com/project/483112/insights/nzAlki4F
- **Subscription Cancellations (Churn)**: https://us.posthog.com/project/483112/insights/MYY1cMHP
- **Active Users (Sign-ins)**: https://us.posthog.com/project/483112/insights/wKIMnElw
- **Account Deletions**: https://us.posthog.com/project/483112/insights/cV3PxTxk

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `useEffect` in `app/(dashboard)/layout.tsx` handles this for logged-in users who revisit the dashboard, but verify any other authenticated routes re-identify correctly.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
