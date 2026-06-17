<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration covers client-side initialization, a reverse proxy configuration, server-side event tracking across authentication and Stripe payment flows, user identification on sign-in and sign-up, and error tracking via `capture_exceptions`.

**Files created:**
- `instrumentation-client.ts` — initializes posthog-js via Next.js 15.3+ instrumentation hook with reverse proxy, error tracking, and debug mode
- `lib/posthog-server.ts` — singleton `posthog-node` client for server-side event capture
- `app/(dashboard)/pricing/pricing-tracker.tsx` — client component that fires `pricing_page_viewed` when the pricing page mounts

**Files modified:**
- `next.config.ts` — added `/ingest/*` rewrites (including `/static/` and `/array/` asset paths) and `skipTrailingSlashRedirect: true`
- `app/(login)/actions.ts` — added `user_signed_in`, `user_signed_up`, `user_signed_out`, `account_deleted`, `team_member_invited`, and `team_member_removed` events plus `posthog.identify()` on sign-in/sign-up
- `app/api/stripe/checkout/route.ts` — added `checkout_completed` event with plan and subscription details
- `app/api/stripe/webhook/route.ts` — added `subscription_updated` and `subscription_canceled` events from Stripe webhook payloads
- `app/(dashboard)/pricing/page.tsx` — renders `<PricingTracker />` to capture `pricing_page_viewed`

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completes registration; user is also identified in PostHog | `app/(login)/actions.ts` |
| `user_signed_in` | Existing user signs in; user is also identified in PostHog | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account — key churn signal | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team | `app/(login)/actions.ts` |
| `checkout_completed` | User successfully completes Stripe checkout — key revenue event | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe confirms a subscription status change (e.g. trial → active) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe confirms a subscription cancellation — key churn indicator | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | User views the pricing page — top of subscription conversion funnel | `app/(dashboard)/pricing/page.tsx` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog and add insights based on the events above. Suggested insights:

1. **Signup → Checkout conversion funnel** — funnel from `pricing_page_viewed` → `user_signed_up` → `checkout_completed`
2. **New signups over time** — trends chart of `user_signed_up`
3. **Churn signals** — trends chart of `account_deleted` and `subscription_canceled` on one axis
4. **Revenue events** — trends chart of `checkout_completed`
5. **Team growth** — trends chart of `team_member_invited`

[Create a new dashboard](https://us.posthog.com/project/2/dashboard) · [Create a new insight](https://us.posthog.com/project/2/insights/new)

> Note: The PostHog API key used during this wizard run lacked `dashboard:write` and `insight:write` scopes, so the dashboard could not be created automatically. Use the links above to create it manually.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `posthog.identify()` is called only on sign-in and sign-up server actions; if sessions are restored from a cookie without going through those actions, returning visitors will be anonymous until their next sign-in.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
