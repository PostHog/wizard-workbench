<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS application. Here's what was done:

**Client-side setup:** Created `instrumentation-client.ts` to initialize PostHog using the Next.js 15.3+ native initialization pattern. Configured a reverse proxy via `next.config.ts` rewrites (`/ingest/*`) to improve reliability and reduce ad-blocker interference.

**Server-side setup:** Created `lib/posthog-server.ts` with a `getPostHogClient()` helper (using `posthog-node`) for server-side event capture from Server Actions and API routes.

**User identification:** Added `posthog.identify()` on the server (sign-in and sign-up actions) and on the client (`app/(dashboard)/layout.tsx` UserMenu component), keeping client and server events correlated. Added `posthog.reset()` on sign-out to prevent cross-user event merging.

**Event tracking:** Added 12 business-critical events across Server Actions and API routes covering auth, billing, and team management.

---

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticated | `app/(login)/actions.ts` |
| `user_signed_up` | New user completed registration | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_initiated` | User started a Stripe checkout session | `lib/payments/actions.ts` |
| `subscription_activated` | Checkout completed, subscription live | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed (active/trialing) | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription was cancelled or became unpaid | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent a membership invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member removed from team | `app/(login)/actions.ts` |
| `account_updated` | User updated name or email | `app/(login)/actions.ts` |
| `password_updated` | User changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (soft delete) | `app/(login)/actions.ts` |

---

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/238460) to build insights and dashboards based on these events. Here are five recommended insights for an "Analytics basics" dashboard:

1. **User Growth** – Trends insight on `user_signed_up` over time to track new user acquisition.
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

2. **Signup-to-Subscription Funnel** – Funnel insight with steps: `user_signed_up` → `checkout_initiated` → `subscription_activated`. This shows your billing conversion rate.
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

3. **Daily Active Users** – Trends insight on `user_signed_in` (unique users) to track daily engagement.
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

4. **Churn Risk Events** – Trends insight showing `account_deleted` and `subscription_cancelled` over time to monitor churn signals.
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

5. **Team Collaboration Activity** – Trends insight on `team_member_invited` to measure team growth and collaboration.
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

[Open PostHog Dashboard →](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
