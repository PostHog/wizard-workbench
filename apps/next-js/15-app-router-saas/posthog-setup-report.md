<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. PostHog `posthog-js` and `posthog-node` were installed and configured for both client-side and server-side analytics. Client-side tracking is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve reliability. A `PostHogIdentifier` component was added to the root layout to call `posthog.identify()` whenever a user is authenticated, linking client-side sessions to server-side events. Server-side events are captured in Server Actions and API routes using `posthog-node` via a shared `lib/posthog-server.ts` helper, with all events using the user's database ID as the `distinctId` so client and server events correlate correctly. User identification (including `$set` properties) is called server-side on sign-in and sign-up, and client-side via the `PostHogIdentifier` component.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user successfully creates an account | `app/(login)/actions.ts` |
| `user_signed_in` | Fired when an existing user successfully authenticates | `app/(login)/actions.ts` |
| `account_deleted` | Fired when a user soft-deletes their account — critical churn signal | `app/(login)/actions.ts` |
| `account_updated` | Fired when a user updates their name or email in General Settings | `app/(login)/actions.ts` |
| `password_updated` | Fired when a user successfully changes their password | `app/(login)/actions.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation — growth/virality signal | `app/(login)/actions.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `app/(login)/actions.ts` |
| `checkout_initiated` | Fired when a user triggers the Stripe checkout flow | `lib/payments/actions.ts` |
| `pricing_plan_selected` | Fired client-side when the user clicks "Get Started" on a plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_checkout_completed` | Fired after Stripe checkout succeeds and the team subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fired via Stripe webhook when a subscription changes plan or billing status | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fired via Stripe webhook when a subscription is deleted — critical churn signal | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1313956)
  - [Signup → Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/0qcNm2Hu) — tracks `user_signed_up` → `checkout_initiated`
  - [Daily Sign Ups & Sign Ins](https://us.posthog.com/project/2/insights/bpeY8gFJ) — trends of `user_signed_up` and `user_signed_in`
  - [Account Deletions (Churn Indicator)](https://us.posthog.com/project/2/insights/bhkYwHvM) — weekly `account_deleted` bar chart
  - [Team Growth & Subscription Activity](https://us.posthog.com/project/2/insights/AGwV2grh) — `team_member_invited` and subscription trends
  - [Pricing Page → Checkout Conversion Funnel](https://us.posthog.com/project/2/insights/5PaSA00I) — `pricing_plan_selected` → `checkout_initiated`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
