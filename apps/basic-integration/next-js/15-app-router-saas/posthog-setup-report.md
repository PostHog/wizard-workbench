<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 SaaS starter. Here's what was set up:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ recommended approach (no provider needed)
- **Reverse proxy** configured in `next.config.ts` to route PostHog requests through `/ingest` to avoid ad-blockers
- **Server-side client** at `lib/posthog-server.ts` using `posthog-node` for tracking critical business events in Server Actions and API routes
- **User identification** on both client and server: `posthog.identify()` is called server-side on sign-in/sign-up, and client-side in the dashboard layout's `UserMenu` component
- **Session reset** via `posthog.reset()` on sign-out
- **Error tracking** enabled via `capture_exceptions: true` in the client init
- **14 events** instrumented across auth, payments, and team management flows

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `invitation_accepted` | A user accepted an invitation to join a team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invited a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a Stripe checkout session for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A Stripe subscription was updated (plan change or renewal) | `lib/payments/stripe.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled | `lib/payments/stripe.ts` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Next steps

Build insights and a dashboard to monitor user behavior in PostHog using the events instrumented above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named "Analytics basics (wizard)"
- [New Insight](https://us.posthog.com/project/2/insights/new) — build insights such as:
  - **Signup → Checkout funnel**: `user_signed_up` → `pricing_page_viewed` → `checkout_started` → `checkout_completed`
  - **Churn trend**: `account_deleted` over time
  - **Subscription health**: `subscription_updated` vs `subscription_cancelled` over time
  - **Team growth**: `team_member_invited` and `invitation_accepted` over time
  - **Auth activity**: `user_signed_in` and `user_signed_up` daily counts

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
