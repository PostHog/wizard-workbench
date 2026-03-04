<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 App Router SaaS project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog JS client using the `instrumentation-client` pattern for Next.js 15.3+, with a reverse proxy via `/ingest`, error tracking (`capture_exceptions`), and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog Node client (`posthog-node`) for use in Server Actions and API routes.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*` and `/ingest/*` to route PostHog requests through Next.js, reducing ad blocker interference. Also added `skipTrailingSlashRedirect: true`.
- **`app/(login)/actions.ts`**: Added server-side events for all critical auth and account management flows: sign-in (with `posthog.identify`), sign-up (with `posthog.identify`), sign-out, password update, account deletion, account update, team member invite, and team member removal.
- **`lib/payments/stripe.ts`**: Added `checkout_started` event when a Stripe checkout session is created.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` event after a successful Stripe checkout confirms the subscription.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` event for both `customer.subscription.updated` and `customer.subscription.deleted` Stripe webhook events.
- **`app/(dashboard)/pricing/page.tsx`**: Added server-side `pricing_page_viewed` event to track the top of the conversion funnel.
- **`app/(dashboard)/pricing/submit-button.tsx`**: Added client-side `checkout_clicked` event when a user clicks "Get Started" on a pricing plan.
- **`app/(dashboard)/layout.tsx`**: Added client-side `posthog.identify()` call in `UserMenu` to link anonymous sessions to known users whenever user data loads, and `posthog.reset()` on sign-out to unlink the session.
- **`.env.local`**: Populated `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated checkout for a subscription plan | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Team subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new member to their team | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a member from their team | `app/(login)/actions.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |
| `checkout_clicked` | User clicked Get Started on a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to your [PostHog project](https://us.posthog.com/project/2/dashboards) and create a new dashboard with these recommended insights:

1. **Signup funnel** — Funnel from `pricing_page_viewed` → `checkout_clicked` → `checkout_started` → `checkout_completed`. This tracks conversion from interest to paid subscription.
2. **New signups over time** — Trend of `user_signed_up` events. Tracks user acquisition.
3. **Churn events** — Trend of `account_deleted` events. Tracks account cancellations.
4. **Active users (sign-ins)** — Trend of `user_signed_in` events. Tracks retention and engagement.
5. **Team growth** — Trend of `team_member_invited` events. Tracks expansion/virality.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
