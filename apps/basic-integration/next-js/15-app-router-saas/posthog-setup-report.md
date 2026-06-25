<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS project. Here is a summary of what was added:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js's recommended `instrumentation-client` file. Enables autocapture, session replay, and exception tracking. Routes events through a reverse proxy at `/ingest`.
- **`lib/posthog-server.ts`** (new): Server-side PostHog client factory using `posthog-node`. Used by all server actions and API routes.
- **`next.config.ts`** (updated): Added `/ingest/*` reverse proxy rewrites so browser events are less likely to be blocked by ad blockers.
- **`app/(login)/actions.ts`** (updated): Server-side capture for sign-in, sign-up, sign-out, password update, account deletion, account update, team member invitation, and team member removal. Server-side `identify` is called on sign-in and sign-up.
- **`lib/payments/actions.ts`** (updated): Captures `checkout_started` when a user initiates a Stripe checkout session.
- **`app/api/stripe/checkout/route.ts`** (updated): Captures `checkout_completed` after a successful Stripe checkout, and captures exceptions on errors.
- **`app/api/stripe/webhook/route.ts`** (updated): Captures `subscription_updated` and `subscription_cancelled` when Stripe sends subscription lifecycle webhooks.
- **`app/(dashboard)/layout.tsx`** (updated): Client-side `posthog.identify()` called when the user data loads in the authenticated layout. `posthog.reset()` called on sign-out to prevent session bleeding across users.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fires when a user successfully authenticates with their email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | Fires when a new user creates an account, either standalone or via team invitation. | `app/(login)/actions.ts` |
| `user_signed_out` | Fires when a user signs out of their account. | `app/(login)/actions.ts` |
| `password_updated` | Fires when a user successfully changes their account password. | `app/(login)/actions.ts` |
| `account_deleted` | Fires when a user permanently deletes their account (churn signal). | `app/(login)/actions.ts` |
| `account_updated` | Fires when a user saves changes to their account name or email. | `app/(login)/actions.ts` |
| `team_member_invited` | Fires when a team owner sends an invitation to a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | Fires when a team owner removes a member from the team. | `app/(login)/actions.ts` |
| `checkout_started` | Fires when a user initiates the Stripe checkout flow for a subscription plan. | `lib/payments/actions.ts` |
| `checkout_completed` | Fires when a user successfully completes a Stripe checkout session and gains a subscription. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Fires via Stripe webhook when a team's subscription status changes to active or trialing. | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Fires via Stripe webhook when a team's subscription is cancelled or becomes unpaid (churn signal). | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1761170)
- **Signups & Signins trend (DAU)**: https://us.i.posthog.com/project/483112/insights/fFxFUi2Q
- **Conversion funnel: Signup → Checkout**: https://us.i.posthog.com/project/483112/insights/8cp5IiMe
- **Churn signals over time**: https://us.i.posthog.com/project/483112/insights/KvHWgehq
- **Checkout completion rate**: https://us.i.posthog.com/project/483112/insights/9h60rvpV
- **New signups over time**: https://us.i.posthog.com/project/483112/insights/EYFxLOv7

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies in the dashboard layout's `UserMenu` component when user data loads, which covers both fresh logins and returning sessions. Verify this fires correctly in your environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
