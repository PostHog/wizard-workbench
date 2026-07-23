<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js 15 Pages Router SaaS application with PostHog analytics. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes posthog-js for client-side tracking with reverse proxy, exception capture, and dev-mode debug logging.
- **`next.config.ts`**: Added reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` to route PostHog requests through Next.js and avoid ad-blocker interception.
- **`lib/posthog-server.ts`** (new): Shared singleton PostHog Node.js client with `flushAt: 1` / `flushInterval: 0` for short-lived API routes.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/login.tsx`**: Captures `sign_in_submitted` / `sign_up_submitted` on form submit; sends PostHog tracing headers to the API; identifies user on successful auth; captures exceptions on failure.
- **`components/header.tsx`**: Captures `user_signed_out` and calls `posthog.reset()` before the sign-out API call.
- **`pages/pricing.tsx`**: Captures `checkout_initiated` with plan name, price, interval, and trial days on form submit.
- **`pages/dashboard/general.tsx`**: Captures `account_updated` (with fields updated list) on successful account save; captures exceptions on error.
- **`pages/api/auth/sign-in.ts`**: Server-side `user_signed_in` event + `posthog.identify()` using the authenticated user ID; reads `X-POSTHOG-DISTINCT-ID` header to link client anonymous session; returns `userId` to client for client-side identify.
- **`pages/api/auth/sign-up.ts`**: Server-side `user_signed_up` event + `posthog.identify()` for new users; links anonymous session via tracing header; returns `userId` to client.
- **`pages/api/stripe/create-checkout.ts`**: Server-side `checkout_session_created` event with user, team, and price IDs.
- **`pages/api/stripe/webhook.ts`**: Server-side `subscription_updated` / `subscription_cancelled` events triggered by Stripe webhook for subscription lifecycle changes.
- **`pages/api/stripe/customer-portal.ts`**: Server-side `customer_portal_opened` event.
- **`pages/api/team/invite.ts`**: Server-side `team_member_invited` event with team ID and invitee role.
- **`pages/api/team/remove-member.ts`**: Server-side `team_member_removed` event with team ID and removed member ID.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `sign_in_submitted` | User submitted the sign-in form on the login page | `components/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form to create a new account | `components/login.tsx` |
| `checkout_initiated` | User clicked Get Started to begin checkout for a pricing plan | `pages/pricing.tsx` |
| `account_updated` | User saved changes to their account name or email in general settings | `pages/dashboard/general.tsx` |
| `user_signed_in` | User successfully authenticated via the sign-in API | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A new user account was successfully created via the sign-up API | `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out and their session was cleared | `components/header.tsx` |
| `checkout_session_created` | A Stripe checkout session was created for the user to subscribe to a plan | `pages/api/stripe/create-checkout.ts` |
| `team_member_invited` | A team owner sent an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team | `pages/api/team/remove-member.ts` |
| `subscription_updated` | A Stripe subscription was updated via webhook (plan change or renewal) | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled via webhook | `pages/api/stripe/webhook.ts` |
| `customer_portal_opened` | User opened the Stripe customer portal to manage their subscription | `pages/api/stripe/customer-portal.ts` |

## Next steps

We've built a dashboard and five insights in PostHog to keep an eye on user behavior, based on the events just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1897374)
  - Signup to checkout funnel (wizard)
  - New user signups (wizard)
  - Subscription changes (wizard)
  - Team member invitations (wizard)
  - Checkout initiated by plan (wizard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login/signup; ensure server-side session validation on page refresh also calls `posthog.identify()` so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
