<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS starter. PostHog is initialized client-side via `instrumentation-client.ts` (using the `/ingest` reverse proxy), a server-side singleton client is in `lib/posthog-server.ts`, and `next.config.ts` is updated with the required rewrites for the proxy. Events are tracked across authentication, payments, team management, and account flows — with `posthog.identify()` called on both client and server at sign-in/sign-up to link sessions to known users.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires on the server when a user successfully authenticates with email and password. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Fires on the server when a new user account is successfully created. | `pages/api/auth/sign-up.ts` |
| `invitation_accepted` | Fires on the server when a new user signs up via a team invitation link. | `pages/api/auth/sign-up.ts` |
| `user_signed_out` | Fires on the client when a user clicks sign out and the session is cleared. | `components/header.tsx` |
| `pricing_page_viewed` | Fires on the client when the pricing page is rendered, marking the top of the payment conversion funnel. | `pages/pricing.tsx` |
| `checkout_started` | Fires on the client when a user clicks Get Started on a pricing plan and the checkout request is sent. | `pages/pricing.tsx` |
| `subscription_updated` | Fires on the server via Stripe webhook when a subscription plan or status changes. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Fires on the server via Stripe webhook when a subscription is deleted or cancelled. | `pages/api/stripe/webhook.ts` |
| `subscription_management_opened` | Fires on the client when a user clicks Manage Subscription to open the Stripe customer portal. | `pages/dashboard/index.tsx` |
| `team_member_invited` | Fires on the server when an owner successfully sends a team invitation email. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fires on the server when a team owner removes a member from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | Fires on the server when a user successfully updates their name or email in general settings. | `pages/api/account/update.ts` |

## Next steps

Dashboard creation was skipped — the CI API key in this environment has read-only scopes (`dashboard:read` only). To create the recommended dashboards manually, go to PostHog → Dashboards → New and add these insights:

- **Sign-up Conversion Funnel** (Funnel): `pricing_page_viewed` → `checkout_started` → `user_signed_up`
- **Daily Sign-ups** (Trend): `user_signed_up` over time
- **Daily Sign-ins** (Trend): `user_signed_in` over time
- **Subscription Events** (Trend): `subscription_updated` + `subscription_cancelled` on one chart
- **Team Activity** (Trend): `team_member_invited` + `team_member_removed` on one chart

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
