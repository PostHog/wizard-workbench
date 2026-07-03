<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration includes client-side initialization via `instrumentation-client.ts`, a reverse proxy through Next.js rewrites, a shared server-side PostHog client (`lib/posthog-server.ts`), user identification at sign-in and sign-up, and 13 tracked events covering the full user and revenue lifecycle — from pricing page view through checkout, subscription changes, and team management.

| Event Name | Description | File |
|---|---|---|
| `pricing_page_viewed` | User lands on the pricing page, marking the top of the checkout conversion funnel. | `pages/pricing.tsx` |
| `checkout_started` | User clicks Get Started on a pricing plan to begin the Stripe checkout flow. | `pages/pricing.tsx` |
| `user_signed_out` | User signs out via the header dropdown menu. | `components/header.tsx` |
| `manage_subscription_clicked` | User clicks the Manage Subscription button to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `team_member_invite_submitted` | User submits the invite team member form from the dashboard. | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removes a team member from the dashboard team members list. | `pages/dashboard/index.tsx` |
| `account_updated` | User saves updated account name or email from the general settings page. | `pages/dashboard/general.tsx` |
| `user_signed_up` | New user account created successfully on the server. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | User authenticated and signed in successfully on the server. | `pages/api/auth/sign-in.ts` |
| `checkout_session_created` | Stripe checkout session created for a user selecting a pricing plan. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A team's subscription status changed via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A team's subscription was cancelled or deleted via Stripe webhook. | `pages/api/stripe/webhook.ts` |
| `team_member_invitation_sent` | Team member invitation email was sent successfully on the server. | `pages/api/team/invite.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793504)
- [Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/mvpKIBgM)
- [New Signups Over Time](https://us.posthog.com/project/483112/insights/tWxG2cvD)
- [Sign-Ins vs Sign-Ups](https://us.posthog.com/project/483112/insights/YUxTRwCD)
- [Subscription Cancellations](https://us.posthog.com/project/483112/insights/piUsBiPH)
- [Team Activity](https://us.posthog.com/project/483112/insights/km6zXB98)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on sign-in and sign-up, but users who return with an active session (visiting `/dashboard` directly) will remain on their anonymous distinct ID until they sign in again. Consider calling `posthog.identify()` when the `/api/user` SWR response resolves with a known user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
