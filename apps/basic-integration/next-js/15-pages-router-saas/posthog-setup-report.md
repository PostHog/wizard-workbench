<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js on the client using Next.js 15.3+ instrumentation support, with reverse-proxy ingestion, error tracking, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` so analytics traffic routes through the app's own domain.
- **`components/login.tsx`**: On successful sign-in or sign-up, calls `posthog.identify()` with the user's email. Also passes the anonymous PostHog distinct ID and session ID as `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to the auth API routes for client–server event correlation.
- **`components/header.tsx`**: Captures `user_signed_out` and calls `posthog.reset()` before the sign-out API call.
- **`pages/api/auth/sign-in.ts`**: Captures `user_signed_in` server-side using the client's distinct ID from the request header.
- **`pages/api/auth/sign-up.ts`**: Calls `posthog.identify()` and captures `user_signed_up` server-side using the client's distinct ID.
- **`pages/api/stripe/create-checkout.ts`**: Captures `checkout_session_created` server-side with price and team context.
- **`pages/api/stripe/webhook.ts`**: Captures `subscription_updated` server-side when Stripe fires `customer.subscription.updated` or `customer.subscription.deleted`.
- **`pages/api/team/invite.ts`**: Captures `team_member_invited` server-side with role and team context.
- **`pages/pricing.tsx`**: Captures `checkout_initiated` client-side when the user submits a pricing plan form.
- **`pages/dashboard/index.tsx`**: Captures `manage_subscription_clicked` and `team_member_removed` client-side.
- **`pages/dashboard/general.tsx`**: Captures `account_updated` client-side on successful profile save.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fires on the server when a new user completes registration. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fires on the server when an existing user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fires client-side before session is cleared and PostHog is reset. | `components/header.tsx` |
| `checkout_initiated` | Fires client-side when a user submits a pricing plan form to start checkout. | `pages/pricing.tsx` |
| `checkout_session_created` | Fires on the server when a Stripe checkout session is successfully created. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Fires on the server via Stripe webhook when a subscription status changes. | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fires on the server when a team owner sends an invitation to a new member. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fires client-side when a team owner removes a member from the team. | `pages/dashboard/index.tsx` |
| `manage_subscription_clicked` | Fires client-side when a user clicks the Manage Subscription button. | `pages/dashboard/index.tsx` |
| `account_updated` | Fires client-side when a user saves changes to their account information. | `pages/dashboard/general.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1760708)
- [Signup-to-Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/ayGrRrow)
- [Daily Active Signups](https://us.posthog.com/project/483112/insights/51RvejPJ)
- [Checkout Initiation Rate](https://us.posthog.com/project/483112/insights/s8QrCLP4)
- [Team Collaboration (Invites)](https://us.posthog.com/project/483112/insights/BOUOC4Gr)
- [Subscription Updates](https://us.posthog.com/project/483112/insights/vxqCDmxT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `posthog.identify()` is called at login/signup; verify that users who are already logged in when they load the app also get identified (e.g. by reading the session on app load and calling `posthog.identify()` in `pages/_app.tsx`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
