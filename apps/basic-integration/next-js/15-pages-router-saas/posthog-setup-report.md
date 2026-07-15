<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Client-side tracking is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest` and avoid ad-blocker interference. A shared `lib/posthog-server.ts` helper provides the server-side `posthog-node` client for all API routes. User identity is correlated across client and server by passing the PostHog distinct ID in request headers (`X-POSTHOG-DISTINCT-ID`) and aliasing it to the authenticated user ID on sign-in and sign-up. Error tracking via `capture_exceptions: true` and `captureException` is included for client-side errors.

| Event | Description | File |
|---|---|---|
| `sign_in_submitted` | User submits the sign-in form on the client side | `components/login.tsx` |
| `sign_up_submitted` | User submits the sign-up form on the client side | `components/login.tsx` |
| `sign_out_clicked` | User clicks the sign-out button from the header menu | `components/header.tsx` |
| `checkout_started` | User clicks "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `account_info_saved` | User saves their account name and email | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server confirms a user has successfully authenticated | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server confirms a new user account has been created | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server creates a Stripe checkout session | `pages/api/stripe/create-checkout.ts` |
| `subscription_activated` | Stripe webhook: subscription became active or trialing | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription cancelled or unpaid | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team owner invites a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | A team owner removes a member from their team | `pages/api/team/remove-member.ts` |
| `customer_portal_opened` | Server creates a Stripe customer portal session | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built a dashboard and insights for you to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1853061)
- [Sign-up to active funnel (wizard)](https://us.posthog.com/project/483112/insights/0SKZ5sAQ)
- [New sign-ups over time (wizard)](https://us.posthog.com/project/483112/insights/xlQEGcAb)
- [Checkout sessions created (wizard)](https://us.posthog.com/project/483112/insights/kvnSu55f)
- [Subscription changes (wizard)](https://us.posthog.com/project/483112/insights/uBCcZDUE)
- [Team activity (wizard)](https://us.posthog.com/project/483112/insights/NXVKIQjh)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
