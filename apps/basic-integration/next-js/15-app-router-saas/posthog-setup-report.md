<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router SaaS starter. It installed the PostHog web and node SDKs, initialized client-side tracking in `instrumentation-client.ts`, added a reverse-proxy ingest rewrite in `next.config.ts`, created a shared server PostHog client in `lib/posthog-server.ts`, instrumented key auth, billing, and team-management flows across client and server code, configured the required local environment variables in `.env.local`, and created a starter PostHog dashboard with five saved insights. Verification included a production build attempt; the app compiled and typechecked through the changed PostHog code, but final build collection is currently blocked by a missing `POSTGRES_URL` environment variable in this environment.

| Event name | Description | File |
| --- | --- | --- |
| sign_in_submitted | Captures when a visitor submits the sign-in form from the client. | app/(login)/login.tsx |
| sign_up_submitted | Captures when a visitor submits the sign-up form from the client. | app/(login)/login.tsx |
| user_signed_in | Captures a successful sign-in on the server using the authenticated user id. | app/(login)/actions.ts |
| user_signed_up | Captures successful account creation on the server for new users. | app/(login)/actions.ts |
| team_member_invited | Captures when an owner successfully sends a team invitation. | app/(login)/actions.ts |
| account_updated | Captures when a user successfully updates account details. | app/(login)/actions.ts |
| password_updated | Captures when a user successfully changes the account password. | app/(login)/actions.ts |
| account_deleted | Captures when a user successfully deletes the account. | app/(login)/actions.ts |
| pricing_cta_clicked | Captures when a visitor starts the pricing checkout flow from the client. | app/(dashboard)/pricing/submit-button.tsx |
| billing_portal_opened | Captures when a signed-in user opens the Stripe billing portal. | lib/payments/actions.ts |
| checkout_started | Captures when the server begins creating a Stripe checkout session. | lib/payments/actions.ts |
| subscription_checkout_completed | Captures when Stripe checkout completion updates the team subscription on the server. | app/api/stripe/checkout/route.ts |
| subscription_webhook_processed | Captures when a Stripe subscription webhook is processed successfully. | app/api/stripe/webhook/route.ts |
| team_member_removed | Captures when an owner removes a member from the team. | app/(login)/actions.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796423
- Insight: Auth submissions over time (wizard) — https://us.posthog.com/project/483112/insights/fFZIjA7T
- Insight: Successful auth events over time (wizard) — https://us.posthog.com/project/483112/insights/wK24CV5c
- Insight: Checkout completion snapshot (wizard) — https://us.posthog.com/project/483112/insights/GWJqG3oV
- Insight: Team management activity (wizard) — https://us.posthog.com/project/483112/insights/fyLUkrGB
- Insight: Subscription webhook processing (wizard) — https://us.posthog.com/project/483112/insights/WSGBC5pt

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
