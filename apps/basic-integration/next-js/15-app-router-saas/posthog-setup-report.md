# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) powered by `posthog-node` captures critical business events across authentication flows, payment/subscription lifecycle, and account management — all areas that cannot be reliably tracked client-side. User identification is performed both server-side (on sign-in and sign-up) and client-side (in the dashboard layout when user data loads), ensuring frontend and backend events are linked to the same person.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired server-side when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired server-side when a user successfully signs in | `app/(login)/actions.ts` |
| `user_signed_out` | Fired server-side when a user signs out | `app/(login)/actions.ts` |
| `account_deleted` | Fired server-side when a user deletes their account | `app/(login)/actions.ts` |
| `checkout_session_started` | Fired server-side when a Stripe checkout session is initiated | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | Fired server-side when a user completes checkout and subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired server-side via Stripe webhook when a subscription status changes | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Fired server-side via Stripe webhook when a subscription is deleted/canceled | `app/api/stripe/webhook/route.ts` |
| `account_settings_updated` | Fired client-side when a user successfully updates their account name or email | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | Fired client-side when a user successfully changes their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | Fired client-side when an owner successfully sends a team invitation | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Fired client-side when a team member is removed from the team | `app/(dashboard)/dashboard/page.tsx` |
| `manage_subscription_clicked` | Fired client-side when a user clicks the Manage Subscription button | `app/(dashboard)/dashboard/page.tsx` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog to monitor the key metrics from the instrumented events. Suggested insights:

1. **Signup → Checkout conversion funnel** — funnel from `user_signed_up` → `checkout_session_started` → `subscription_checkout_completed`
2. **Signups over time** — trends chart of `user_signed_up`
3. **Subscription cancellations** — trends chart of `subscription_canceled`
4. **Account deletions** — trends chart of `account_deleted`
5. **Team growth** — trends chart of `team_member_invited`

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the dashboard layout identifies users on load via SWR, but verify this fires correctly after a hard refresh when a session cookie is already set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
