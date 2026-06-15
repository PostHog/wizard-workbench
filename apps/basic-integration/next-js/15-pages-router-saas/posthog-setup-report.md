# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Client-side analytics are initialised via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with a reverse proxy through `/ingest` to reduce ad-blocker interference. A singleton server-side client (`lib/posthog-server.ts`) using `posthog-node` captures critical business events across seven API routes. Users are identified on the client immediately after a successful sign-in or sign-up using their email as the distinct ID; the same anonymous distinct ID is passed to the server via `X-POSTHOG-DISTINCT-ID` headers so client and server events correlate in the same session. `posthog.reset()` is called on sign-out to unlink future anonymous events from the authenticated session.

| Event | Description | File |
|---|---|---|
| `sign_in_submitted` | User submits the sign-in form (client) | `components/login.tsx` |
| `sign_up_submitted` | User submits the sign-up form (client) | `components/login.tsx` |
| `pricing_plan_selected` | User clicks "Get Started" on a pricing plan | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invite_submitted` | User submits the invite team member form | `pages/dashboard/index.tsx` |
| `team_member_remove_clicked` | User clicks Remove on a team member | `pages/dashboard/index.tsx` |
| `account_settings_updated` | User saves changes to account information | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server: successful authentication and session created | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server: new user account and team created | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | Server: Stripe checkout session created | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | Server: user returned after successful Stripe payment | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Server: Stripe webhook received for subscription update/cancellation | `pages/api/stripe/webhook.ts` |
| `team_member_invite_sent` | Server: team invitation inserted into database | `pages/api/team/invite.ts` |
| `team_member_removed` | Server: team member removed from team | `pages/api/team/remove-member.ts` |

## Next steps

The PostHog MCP API key used during this wizard run did not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. Create a dashboard named **"Analytics basics (wizard)"** manually with the following five insights:

1. **Sign-up & sign-in trend** — Trends chart with `user_signed_up` and `user_signed_in` over time (weekly). Shows new user acquisition vs returning sign-ins.
   → [Create new insight](https://us.posthog.com/project/2/insights/new)

2. **Pricing → Checkout funnel** — Funnel: `pricing_plan_selected` → `checkout_session_created` → `checkout_completed`. Reveals drop-off between interest and payment.

3. **Subscription changes over time** — Trends chart of `subscription_changed` broken down by `subscription_status` property (active, canceled, trialing). Monitors churn signals.

4. **Team collaboration activity** — Trends chart with `team_member_invite_submitted` and `team_member_remove_clicked` over time. Shows team growth and churn activity.

5. **Account settings engagement** — Trends chart of `account_settings_updated` over time. A proxy for user engagement with the product.

→ [Go to Dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login/signup. Consider calling `posthog.identify(email)` on page load when a session cookie is already present (e.g. in `pages/_app.tsx` using the `/api/user` SWR data) so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
