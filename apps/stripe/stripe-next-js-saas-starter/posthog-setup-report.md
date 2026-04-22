<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. The project already had a strong foundation of PostHog instrumentation in place — both `posthog-js` (client-side) and `posthog-node` (server-side) were installed. The wizard verified and completed the integration by:

- **Environment variables**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`
- **Reverse proxy**: Added the missing `/ingest/array/:path*` rewrite rule to `next.config.ts` so all PostHog asset routes are correctly proxied through Next.js

The following capabilities were confirmed already in place:
- Client-side PostHog initialization via `instrumentation-client.ts` (Next.js 15.3+ best practice)
- Server-side PostHog client in `lib/posthog-server.ts` using `posthog-node`
- Client-side user identification via `posthog.identify()` on SWR user fetch in `app/(dashboard)/layout.tsx`
- Client-side `posthog.reset()` on sign-out
- Exception capture enabled (`capture_exceptions: true`)
- 14 business-critical events tracked across server actions and API routes

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password | `app/(login)/actions.ts` |
| `user_signed_up` | User creates a new account, with flag for invitation-based signup | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepts a team invitation during signup | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their account password | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account | `app/(login)/actions.ts` |
| `account_updated` | User updates their name or email in general settings | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member by email | `app/(login)/actions.ts` |
| `checkout_initiated` | User starts the Stripe checkout flow from the pricing page | `lib/payments/actions.ts` |
| `customer_portal_opened` | User opens the Stripe customer portal to manage their subscription | `lib/payments/actions.ts` |
| `checkout_completed` | User completes Stripe checkout and subscription is activated | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription plan or status changes | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | Stripe webhook: subscription is canceled or reaches unpaid status | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/228144/dashboard/1468191
- **Signup → Checkout Conversion Funnel**: https://us.posthog.com/project/228144/insights/Rejsc2sS
- **New Sign-ups Over Time**: https://us.posthog.com/project/228144/insights/pjba3GRc
- **Account Deletions (Churn)**: https://us.posthog.com/project/228144/insights/uW9rQTkw
- **Subscription Events** (completed vs canceled): https://us.posthog.com/project/228144/insights/vm180PKL
- **Daily Active Users (Sign-ins)**: https://us.posthog.com/project/228144/insights/5gDwVemn

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
