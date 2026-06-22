<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A shared server-side client (`lib/posthog-server.ts`) is used across server actions and API routes. User identification is performed client-side in the dashboard layout when user data loads, and `posthog.reset()` is called on sign-out. Thirteen events covering the full user lifecycle — authentication, account management, team operations, and the complete subscription/payment funnel — are captured across both client and server.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully creates an account. | `app/(login)/actions.ts` |
| `user_signed_in` | An existing user successfully signs in. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signs out of their account. | `app/(login)/actions.ts` |
| `account_updated` | A user updates their account name or email. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully updates their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sends an invitation to a new member. | `app/(login)/actions.ts` |
| `team_member_removed` | A team member is removed from the team. | `app/(login)/actions.ts` |
| `pricing_page_viewed` | A user views the pricing page, marking the top of the checkout funnel. | `app/(dashboard)/pricing/page.tsx` |
| `checkout_started` | A user initiates a Stripe checkout session for a subscription plan. | `lib/payments/actions.ts` |
| `checkout_completed` | A user successfully completes a Stripe checkout and acquires a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | A subscription is updated or cancelled via the Stripe webhook. | `app/api/stripe/webhook/route.ts` |
| `customer_portal_opened` | A user opens the Stripe customer portal to manage their subscription. | `lib/payments/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/2/dashboard/1720023)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies users when the dashboard layout loads (via SWR user data), which covers both fresh logins and returning sessions. Verify this works correctly in your production environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
