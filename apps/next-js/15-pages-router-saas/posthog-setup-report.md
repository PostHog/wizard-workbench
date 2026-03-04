<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` on the client side using Next.js 15.3+ instrumentation. Includes automatic error tracking (`capture_exceptions: true`) and a reverse proxy via `/ingest`.
- `lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event capture across API routes.
- `.env.local` — Populated with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

**Modified files:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites and `skipTrailingSlashRedirect: true` to route PostHog traffic through the app (improves ad-blocker resistance and performance).
- `components/login.tsx` — Captures `sign_in_submitted` / `sign_up_submitted` on form submit; calls `posthog.identify()` on success; passes `X-POSTHOG-DISTINCT-ID` header to the API for server-client correlation; captures exceptions.
- `pages/pricing.tsx` — Captures `checkout_started` with plan name and price when user clicks "Get Started".
- `pages/api/auth/sign-in.ts` — Captures server-side `user_signed_in`; calls `posthog.identify()` and `posthog.alias()` to link client anonymous ID to the user's email.
- `pages/api/auth/sign-up.ts` — Captures server-side `user_signed_up`; calls `posthog.identify()` and `posthog.alias()` to link client anonymous ID to the new user's email.
- `pages/api/stripe/create-checkout.ts` — Captures `checkout_session_created` with price and team info.
- `pages/api/stripe/webhook.ts` — Captures `subscription_updated` or `subscription_cancelled` when Stripe subscription webhooks arrive.
- `pages/api/stripe/customer-portal.ts` — Captures `customer_portal_opened` when a user accesses the billing portal.
- `pages/api/team/invite.ts` — Captures `team_member_invited` with invitee email and role.
- `pages/api/team/remove-member.ts` — Captures `team_member_removed` with the removed member ID.
- `pages/dashboard/general.tsx` — Captures `account_updated` on successful account info save; captures exceptions.

**Packages installed:** `posthog-js`, `posthog-node`

---

| Event | Description | File |
|---|---|---|
| `sign_in_submitted` | User submits the sign-in form (client-side, before API response) | `components/login.tsx` |
| `sign_up_submitted` | User submits the sign-up form (client-side, before API response) | `components/login.tsx` |
| `user_signed_in` | Server confirms successful user sign-in; also used to identify the user | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server confirms successful user sign-up and new account creation; also used to identify the user | `pages/api/auth/sign-up.ts` |
| `checkout_started` | User clicks 'Get Started' on a pricing plan to initiate checkout | `pages/pricing.tsx` |
| `checkout_session_created` | Server successfully creates a Stripe checkout session for a user | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Stripe webhook confirms a subscription status change (e.g. trial to active, plan upgrade/downgrade) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook confirms a subscription has been deleted/cancelled | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | Server creates a Stripe customer portal session so user can manage billing | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | Owner successfully sends a team invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Owner successfully removes a member from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User successfully saves changes to their account name or email | `pages/dashboard/general.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these 5 recommended insights:

### 1. Sign-up → Paid Conversion Funnel
Track how many users complete the full journey from sign-up to active subscription.

**Steps:** `sign_up_submitted` → `checkout_started` → `checkout_session_created` → `subscription_updated`

→ [Create this funnel in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

### 2. Daily Sign-ups & Sign-ins
Monitor user growth and engagement over time.

**Events:** `user_signed_up` (new users), `user_signed_in` (returning users)

→ [Create this trend in PostHog](https://us.posthog.com/project/2/insights/new#trend)

### 3. Subscription Cancellations Over Time
Track churn by monitoring subscription cancellation events.

**Event:** `subscription_cancelled`

→ [Create this trend in PostHog](https://us.posthog.com/project/2/insights/new#trend)

### 4. Team Growth (Invitations Sent)
Measure viral/team-led growth through team invitation activity.

**Event:** `team_member_invited`

→ [Create this trend in PostHog](https://us.posthog.com/project/2/insights/new#trend)

### 5. Checkout Abandonment
Identify users who started checkout but didn't convert to a subscription.

**Filter:** Users who triggered `checkout_started` but NOT `subscription_updated` (use a Retention or Funnel insight with drop-off analysis)

→ [Create this insight in PostHog](https://us.posthog.com/project/2/insights/new)

---

→ [Open PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
