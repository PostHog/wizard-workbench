<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS application. Client-side analytics are initialized via `instrumentation-client.ts` (the recommended pattern for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest`. A shared server-side PostHog client (`lib/posthog-server.ts`) is used across all Server Actions and API routes. User identity is established server-side on sign-in and sign-up, mirrored client-side in the dashboard layout via `posthog.identify()`, and cleared on sign-out with `posthog.reset()`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user successfully completes registration and a team is created. | `app/(login)/actions.ts` |
| `user_signed_in` | Fires when an existing user successfully authenticates via the sign-in form. | `app/(login)/actions.ts` |
| `user_signed_out` | Fires when a user explicitly signs out of their account. | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user confirms and completes account deletion. | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user saves changes to their account information such as name or email. | `app/(login)/actions.ts` |
| `team_member_invited` | Fires when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team owner removes a member from the team. | `app/(login)/actions.ts` |
| `subscription_checkout_started` | Fires when a user initiates a Stripe checkout session for a subscription plan. | `lib/payments/stripe.ts` |
| `subscription_checkout_completed` | Fires when a user successfully completes the Stripe checkout flow and subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Fires when a subscription status changes via Stripe webhook (updated or canceled). | `app/api/stripe/webhook/route.ts` |
| `pricing_page_viewed` | Fires when a user views the pricing page, marking entry into the conversion funnel. | `app/(dashboard)/pricing/pricing-page-tracker.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1760669)
  - [Signup to Checkout Funnel](https://us.i.posthog.com/project/483112/insights/9586347)
  - [Daily Active Users](https://us.i.posthog.com/project/483112/insights/9586353)
  - [Subscription Conversions](https://us.i.posthog.com/project/483112/insights/9586360)
  - [Team Growth](https://us.i.posthog.com/project/483112/insights/9586361)
  - [Account Churn Risk](https://us.i.posthog.com/project/483112/insights/9586362)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
