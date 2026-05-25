<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client side using Next.js 15.3+ instrumentation hooks. Configured with a reverse proxy (`/ingest`) to route PostHog traffic through the app and avoid ad blockers. Enables automatic exception capture.
- **`next.config.ts`**: Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the app. Added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture, used by server actions and API routes.
- **`.env.local`** (new): Stores `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`app/(login)/actions.ts`**: Added server-side PostHog event captures and `identify` calls in `signIn`, `signUp`, `signOut`, `updateAccount`, `updatePassword`, `deleteAccount`, `inviteTeamMember`, and `removeTeamMember`.
- **`app/api/stripe/checkout/route.ts`**: Added `checkout_completed` event capture when a Stripe checkout session is successfully processed.
- **`app/api/stripe/webhook/route.ts`**: Added `subscription_updated` and `subscription_cancelled` event captures triggered by Stripe webhook events.
- **`app/(dashboard)/pricing/submit-button.tsx`**: Added client-side `pricing_plan_selected` event capture on button click, with plan name and price ID as properties.
- **`app/(dashboard)/pricing/page.tsx`**: Updated `SubmitButton` usage to pass `planName` and `priceId` props.
- **`app/(dashboard)/layout.tsx`**: Added `posthog.identify()` via `useEffect` when user data loads, and `posthog.reset()` on sign-out to properly associate/disassociate sessions.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user successfully created an account and team | `app/(login)/actions.ts` |
| `user_signed_in` | A user successfully authenticated with their credentials | `app/(login)/actions.ts` |
| `user_signed_out` | A user ended their session | `app/(login)/actions.ts` |
| `account_updated` | A user updated their account name or email | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password | `app/(login)/actions.ts` |
| `account_deleted` | A user permanently deleted their account | `app/(login)/actions.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member | `app/(login)/actions.ts` |
| `team_member_removed` | A team owner removed a member from the team | `app/(login)/actions.ts` |
| `checkout_completed` | A user successfully completed a Stripe checkout and subscribed to a plan | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A team's subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | A team's subscription was cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `pricing_plan_selected` | A user clicked 'Get Started' on a pricing plan card | `app/(dashboard)/pricing/submit-button.tsx` |

## Next steps

We've designed an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog at [/dashboard](/dashboard) with these five insights:

1. **Signup → Checkout Funnel** — Funnel insight with steps: `user_signed_up` → `pricing_plan_selected` → `checkout_completed`. Shows where users drop off in the conversion flow.

2. **New Signups Over Time** — Trends insight for `user_signed_up`, grouped by day. Tracks growth momentum.

3. **Subscription Cancellations** — Trends insight for `subscription_cancelled`, grouped by day. Early warning for churn spikes.

4. **Account Deletions** — Trends insight for `account_deleted`, grouped by day. Monitors hard churn.

5. **Team Collaboration Activity** — Trends insight showing `team_member_invited` and `team_member_removed` side-by-side. Reflects engagement with the team-collaboration features.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
