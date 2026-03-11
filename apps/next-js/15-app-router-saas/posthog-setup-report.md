<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach with reverse proxy, exception capture, and debug mode.
- **Server-side client** via `lib/posthog-server.ts` using `posthog-node` for tracking server actions and API routes.
- **Reverse proxy** configured in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability.
- **User identification** on both client (login form submit, dashboard header) and server (signIn, signUp, updateAccount actions).
- **Session reset** on sign-out via `posthog.reset()`.
- **14 custom events** tracked across the full user lifecycle from signup through subscription and churn.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully signed into their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `invitation_accepted` | User signed up using a team invitation link | `app/(login)/actions.ts` |
| `checkout_initiated` | User initiated a Stripe checkout session from the pricing page | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed a Stripe checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe subscription was updated (plan change, trial started, etc.) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe subscription was canceled | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removed a member from the team | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information (name or email) | `app/(login)/actions.ts` |
| `password_updated` | User successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `customer_portal_opened` | User opened the Stripe customer billing portal to manage subscription | `lib/payments/actions.ts` |

## Next steps

To get the most out of your PostHog integration, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup & Conversion Funnel** — Funnel: `user_signed_up` → `checkout_initiated` → `checkout_completed`
2. **New Signups Over Time** — Trend: `user_signed_up` (daily/weekly)
3. **Active Subscriptions** — Trend: `checkout_completed` vs `subscription_canceled`
4. **Churn Events** — Trend: `account_deleted` + `subscription_canceled`
5. **Team Growth** — Trend: `team_member_invited` + `invitation_accepted`

Visit your [PostHog project](https://us.posthog.com/project/2) to create and view these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
