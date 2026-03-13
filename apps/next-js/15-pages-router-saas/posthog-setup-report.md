<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The integration covers client-side initialization via `instrumentation-client.ts`, a server-side PostHog singleton in `lib/posthog-server.ts`, a reverse proxy via Next.js rewrites, user identification on sign-in and sign-up (with anonymous-to-identified aliasing), error tracking via `captureException`, and event tracking across 9 key business actions spanning both client and server.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `components/login.tsx` |
| `user_signed_up` | User successfully created an account | `components/login.tsx` |
| `user_signed_out` | User signed out | `components/header.tsx` |
| `checkout_started` | User initiated checkout from pricing page | `pages/pricing.tsx` |
| `subscription_updated` | Stripe subscription was updated (webhook) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription was cancelled (webhook) | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | A team member was invited | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account info | `pages/dashboard/general.tsx` |

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization with reverse proxy, error tracking, and debug mode
- `lib/posthog-server.ts` — Server-side PostHog singleton (posthog-node) for API routes

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for PostHog
- `components/login.tsx` — Added identify, sign-in/sign-up events, exception capture, and `X-POSTHOG-DISTINCT-ID` header
- `components/header.tsx` — Added sign-out event and `posthog.reset()`
- `pages/pricing.tsx` — Added checkout_started event
- `pages/api/stripe/webhook.ts` — Added server-side subscription events
- `pages/api/team/invite.ts` — Added server-side team_member_invited event
- `pages/api/team/remove-member.ts` — Added server-side team_member_removed event
- `pages/api/auth/sign-in.ts` — Added server-side identify + anonymous ID aliasing
- `pages/api/auth/sign-up.ts` — Added server-side identify + anonymous ID aliasing

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)) with the following insights:

1. **Sign-up funnel** — Funnel from `checkout_started` → `user_signed_up` (tracks conversion from pricing page to registration)
2. **Daily active users** — Trend of `user_signed_in` events over time
3. **Subscription conversions** — Trend of `subscription_updated` events grouped by status
4. **Churn events** — Trend of `subscription_cancelled` over time
5. **Team growth** — Trend of `team_member_invited` vs `team_member_removed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
