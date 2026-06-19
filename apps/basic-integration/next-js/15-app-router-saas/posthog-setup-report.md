# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Next.js 15 App Router SaaS starter. The integration adds the PostHog JavaScript SDK for client-side event capture, the PostHog Node.js SDK for server-side capture, and wires up 14 custom events across the full user lifecycle: authentication, subscription management, team activity, and account lifecycle. A reverse proxy is configured to avoid ad-blocker interference, and exception capture is enabled. Users are identified on sign-in, sign-up, and on each page load in the dashboard so PostHog can stitch anonymous and authenticated sessions.

| Event name | Description | File |
|---|---|---|
| `pricing_page_viewed` | User views the pricing page, marking the top of the subscription conversion funnel. | `app/(dashboard)/pricing/page.tsx` |
| `checkout_started` | User clicks Get Started on a pricing plan to begin the Stripe checkout flow. | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | User successfully completes a Stripe checkout session and subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team subscription status or plan changes via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | A team subscription is canceled or goes unpaid via Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `subscription_management_opened` | User opens the Stripe customer portal to manage their subscription. | `app/(dashboard)/dashboard/page.tsx` |
| `user_signed_in` | User successfully signs in with email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account from the dashboard navigation. | `app/(dashboard)/layout.tsx` |
| `team_member_invited` | A team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is removed from the team. | `app/(login)/actions.ts` |
| `account_updated` | User updates their account name or email in the general settings. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account permanently. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/2/dashboard)
- Insight 1: Signup conversion funnel — `pricing_page_viewed` → `checkout_started` → `subscription_checkout_completed`
- Insight 2: Daily active signups — `user_signed_up` trend over time
- Insight 3: Subscription cancellations — `subscription_canceled` trend over time
- Insight 4: Account deletions — `account_deleted` trend over time
- Insight 5: Team growth — `team_member_invited` trend over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on sign-in and sign-up but a returning visitor who is already logged in gets identified via the `useEffect` in the dashboard layout. Verify this fires reliably on page load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
