<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router project with PostHog across client and server flows. It installed `posthog-js` and `posthog-node`, initialized browser-side PostHog in `instrumentation-client.ts`, added a reverse proxy rewrite in `next.config.ts`, identified authenticated users from shared session data, and instrumented business-critical events across authentication, billing, checkout completion, Stripe webhooks, and team management actions. It also configured local PostHog environment variables in `.env.local`, created a dashboard, and added five insights based on the implemented event set. Verification was run with `pnpm build`; the integration code compiled, but full build completion is still blocked by existing missing runtime environment variables for the app (`POSTGRES_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `BASE_URL`).

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures successful account sign-in after credentials are validated. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures successful account creation after a new user and team membership are created. | `app/(login)/actions.ts` |
| `team_created` | Captures creation of a new team during self-serve signup. | `app/(login)/actions.ts` |
| `team_invitation_accepted` | Captures successful signup flows that accept a pending team invitation. | `app/(login)/actions.ts` |
| `user_signed_out` | Captures when an authenticated user signs out of the application. | `app/(dashboard)/layout.tsx` |
| `checkout_started` | Captures when a user starts a subscription checkout flow from pricing. | `lib/payments/actions.ts` |
| `billing_portal_opened` | Captures when a team opens the Stripe billing portal from settings. | `lib/payments/actions.ts` |
| `checkout_completed` | Captures successful checkout processing after subscription details are written to the database. | `app/api/stripe/checkout/route.ts` |
| `stripe_webhook_processed` | Captures successful processing of subscription webhook events from Stripe. | `app/api/stripe/webhook/route.ts` |
| `account_updated` | Captures successful account profile updates for authenticated users. | `app/(login)/actions.ts` |
| `password_updated` | Captures successful password changes for authenticated users. | `app/(login)/actions.ts` |
| `account_deleted` | Captures successful account deletion requests after validation passes. | `app/(login)/actions.ts` |
| `team_member_invited` | Captures successful invitations sent to new team members. | `app/(login)/actions.ts` |
| `team_member_removed` | Captures successful removal of a team member from the workspace. | `app/(login)/actions.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825367
- Insight: Successful sign-ins (wizard) — https://us.posthog.com/project/483112/insights/Nlf0yznJ
- Insight: Signup to checkout funnel (wizard) — https://us.posthog.com/project/483112/insights/gdKTO9Ys
- Insight: Team lifecycle events (wizard) — https://us.posthog.com/project/483112/insights/DUV0n9ym
- Insight: Billing actions by type (wizard) — https://us.posthog.com/project/483112/insights/DK8lc7aU
- Insight: Account maintenance events (wizard) — https://us.posthog.com/project/483112/insights/VujhRAAP

## Verify before merging

Current verification status: `pnpm build` was executed from the project root and stopped on missing non-PostHog app environment variables required by existing database/auth/billing code.


- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
