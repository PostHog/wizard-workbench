<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js Pages Router project with PostHog across both client and server flows. It installed `posthog-js` and `posthog-node`, added client initialization via `instrumentation-client.ts`, configured a Next.js reverse proxy in `next.config.ts`, wired environment variables through `.env.local`, added client-side identify/capture/exception calls for authentication, pricing, billing, team, and account flows, and added matching server-side captures plus exception reporting for authentication, checkout, team management, account updates, and Stripe webhook processing.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures successful account sign-in from the authentication form. | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Captures successful account creation from the signup form. | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_out` | Captures when an authenticated user signs out from the account menu. | `components/header.tsx`, `pages/api/auth/sign-out.ts` |
| `pricing_cta_clicked` | Captures when a visitor starts a checkout flow from the pricing page. | `pages/pricing.tsx` |
| `billing_portal_opened` | Captures when a user opens subscription management from the dashboard. | `pages/dashboard/index.tsx` |
| `team_member_invited` | Captures when a team owner successfully invites a teammate. | `pages/dashboard/index.tsx`, `pages/api/team/invite.ts` |
| `team_member_removed` | Captures when a team member is removed from a workspace. | `pages/dashboard/index.tsx`, `pages/api/team/remove-member.ts` |
| `account_updated` | Captures when a user successfully updates account profile details. | `pages/dashboard/general.tsx`, `pages/api/account/update.ts` |
| `checkout_session_created` | Captures successful checkout session creation on the server. | `pages/api/stripe/create-checkout.ts` |
| `stripe_subscription_updated` | Captures processed subscription updates received from Stripe webhooks. | `pages/api/stripe/webhook.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831214)
- [User signups (wizard)](https://us.posthog.com/project/483112/insights/8OxtasZi)
- [User signins (wizard)](https://us.posthog.com/project/483112/insights/Eln0UcYk)
- [Signup funnel (wizard)](https://us.posthog.com/project/483112/insights/iO0NZvFo)
- [Checkout sessions created (wizard)](https://us.posthog.com/project/483112/insights/I7kIvL6b)
- [Team management actions (wizard)](https://us.posthog.com/project/483112/insights/VIUACDUv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
