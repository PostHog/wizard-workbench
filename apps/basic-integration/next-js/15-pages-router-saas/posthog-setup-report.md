<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics, session replay, and error tracking into this Next.js 15 Pages Router SaaS application. The integration covers all critical user flows: authentication, subscription management, team collaboration, and account settings. Both client-side and server-side (Stripe webhook) events are instrumented.

**Files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the `posthog-js` SDK with a reverse proxy, error capture enabled, and debug mode in development.
- `next.config.ts` — Rewrites added to proxy PostHog events through `/ingest`, reducing ad-blocker interference.
- `lib/posthog-server.ts` — Shared PostHog Node.js client helper for server-side event capture.

**Files edited:**
- `components/login.tsx` — `posthog.identify()` and sign-in/sign-up events captured on successful authentication; errors captured via `captureException`.
- `components/header.tsx` — Sign-out event captured and `posthog.reset()` called to clear the identified user.
- `pages/pricing.tsx` — Checkout start event captured when a user initiates a Stripe checkout session.
- `pages/dashboard/index.tsx` — Subscription portal open, team member invite, and team member remove events captured.
- `pages/dashboard/general.tsx` — Account update event captured on successful save.
- `pages/api/stripe/webhook.ts` — Server-side subscription update and cancellation events captured via `posthog-node`.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in | `components/login.tsx` |
| `user_signed_up` | New user successfully created an account | `components/login.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |
| `checkout_started` | User initiated a Stripe checkout session for a pricing plan | `pages/pricing.tsx` |
| `subscription_management_opened` | User opened the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team member was removed from the team | `pages/dashboard/index.tsx` |
| `account_updated` | User updated their account name or email | `pages/dashboard/general.tsx` |
| `subscription_updated` | Stripe subscription updated (plan change, renewal) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe subscription cancelled or deleted | `pages/api/stripe/webhook.ts` |

## Next steps

To explore the events captured by this integration, visit your PostHog project:

- [Events explorer](/events) — Browse raw events as they arrive
- [Insights](/insights) — Build trend charts, funnels, and retention analyses
- [Dashboards](/dashboard) — Create an "Analytics basics" dashboard with key metrics

**Suggested dashboard insights:**
1. **Signup → Checkout funnel** — Funnel from `user_signed_up` → `checkout_started` → `subscription_updated` to measure conversion rate from new users to paying customers.
2. **Daily active sign-ins** — Trends chart of `user_signed_in` over time.
3. **Team growth** — Trends chart of `team_member_invited` to track collaboration adoption.
4. **Subscription health** — Compare `subscription_updated` vs `subscription_cancelled` to monitor churn.
5. **Checkout drop-off** — Funnel from `checkout_started` → `subscription_updated` to identify checkout abandonment.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
