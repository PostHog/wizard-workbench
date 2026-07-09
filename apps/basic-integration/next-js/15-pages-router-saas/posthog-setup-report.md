<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. It installed `posthog-js` and `posthog-node`, initialized client-side PostHog in `instrumentation-client.ts`, added an ingest reverse proxy in `next.config.ts`, created a reusable server-side PostHog helper, wired user identification into authenticated client flows, and instrumented key authentication, billing, account, and team-management actions across client and API routes. It also created a PostHog dashboard and five insights based on the implemented events.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Tracks successful user sign-ins from the authentication flow. | `components/login.tsx` |
| `user_signed_up` | Tracks successful account creation from the signup flow. | `components/login.tsx` |
| `checkout_started` | Tracks when a visitor starts a checkout flow from pricing. | `pages/pricing.tsx` |
| `account_updated` | Tracks successful account profile updates. | `pages/dashboard/general.tsx` |
| `team_member_invited` | Tracks successful team member invitations. | `pages/dashboard/index.tsx` |
| `team_member_removed` | Tracks successful member removals from a team. | `pages/dashboard/index.tsx` |
| `subscription_portal_opened` | Tracks when a signed-in user opens the billing portal. | `pages/dashboard/index.tsx` |
| `server_user_signed_in` | Tracks successful sign-ins on the server for reliable authentication analytics. | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Tracks successful signups on the server for reliable conversion analytics. | `pages/api/auth/sign-up.ts` |
| `server_checkout_created` | Tracks server-side checkout session creation attempts. | `pages/api/stripe/create-checkout.ts` |
| `stripe_subscription_updated` | Tracks Stripe webhook subscription state changes. | `pages/api/stripe/webhook.ts` |
| `server_account_updated` | Tracks successful account updates on the server. | `pages/api/account/update.ts` |
| `server_team_member_invited` | Tracks successful team invitations on the server. | `pages/api/team/invite.ts` |
| `server_team_member_removed` | Tracks successful team member removals on the server. | `pages/api/team/remove-member.ts` |
| `server_subscription_portal_opened` | Tracks successful billing portal session creation on the server. | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825371
- Insight: Auth volume (wizard) — https://us.posthog.com/project/483112/insights/gg7i6y62
- Insight: Checkout starts by destination (wizard) — https://us.posthog.com/project/483112/insights/54a0SZNH
- Insight: Signup to checkout funnel (wizard) — https://us.posthog.com/project/483112/insights/ilUbWeMb
- Insight: Team management actions (wizard) — https://us.posthog.com/project/483112/insights/Zx23wEFr
- Insight: Server billing and auth actions (wizard) — https://us.posthog.com/project/483112/insights/qjqFvwaX

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
