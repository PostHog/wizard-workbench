<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. Both client-side and server-side tracking are fully wired up, with user identification, error capture, and a reverse proxy for improved reliability.

**New files created:**
- `instrumentation-client.ts` — Initializes posthog-js on the client using Next.js 15.3+ instrumentation hook, with reverse proxy, exception capture, and debug mode.
- `lib/posthog-server.ts` — Singleton PostHog Node.js client for server-side event capture across API routes.

**Files modified:**
- `next.config.ts` — Added `/ingest/*` rewrites to proxy PostHog requests through the app (tracking-blocker resistance), plus `skipTrailingSlashRedirect: true`.
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
- `components/login.tsx` — Added `sign_in_submitted` / `sign_up_submitted` capture, `posthog.identify()` on success, and `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to correlate client and server sessions.
- `components/header.tsx` — Added `posthog.reset()` on sign-out to unlink the session.
- `pages/pricing.tsx` — Added `checkout_started` capture with plan and price details.
- `pages/dashboard/index.tsx` — Added `team_member_invited`, `team_member_removed`, and `subscription_management_opened` captures.
- `pages/dashboard/general.tsx` — Added `account_updated` capture.
- `pages/api/auth/sign-in.ts` — Server-side `sign_in_succeeded` event with `posthog.identify()`, using the client-supplied distinct ID for cross-domain correlation.
- `pages/api/auth/sign-up.ts` — Server-side `sign_up_succeeded` event with `posthog.identify()`, including `via_invite` property.
- `pages/api/stripe/webhook.ts` — Server-side `subscription_changed` event on Stripe webhook, capturing status and event type.

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `sign_in_submitted` | User submitted the sign-in form | `components/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form | `components/login.tsx` |
| `checkout_started` | User clicked Get Started on a pricing plan | `pages/pricing.tsx` |
| `team_member_invited` | User successfully sent a team invitation | `pages/dashboard/index.tsx` |
| `team_member_removed` | User removed a member from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User saved changes to their account | `pages/dashboard/general.tsx` |
| `subscription_management_opened` | User opened the Stripe customer portal | `pages/dashboard/index.tsx` |
| `sign_in_succeeded` | Server-side: user successfully authenticated | `pages/api/auth/sign-in.ts` |
| `sign_up_succeeded` | Server-side: new user account created | `pages/api/auth/sign-up.ts` |
| `subscription_changed` | Server-side: Stripe subscription updated/deleted | `pages/api/stripe/webhook.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights to monitor your core business metrics:

1. **Sign-up Conversion Funnel** — Funnel from `sign_up_submitted` → `sign_up_succeeded`. Shows how many users who attempt sign-up actually complete it.

2. **Checkout Conversion Funnel** — Funnel from `checkout_started` → `sign_up_succeeded` (or `sign_in_succeeded`). Shows how many visitors who click a pricing plan complete onboarding.

3. **Daily Signups & Sign-ins Trend** — Trend chart with both `sign_up_succeeded` and `sign_in_succeeded` over time. Track growth and retention at a glance.

4. **Team Invitations Sent** — Trend of `team_member_invited` over time. Signals team adoption and viral growth.

5. **Subscription Changes** — Trend of `subscription_changed` broken down by `subscription_status` property. Track upgrades, downgrades, and cancellations.

Create these at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
