<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router SaaS application. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes `posthog-js` on the client using the Next.js 15.3+ instrumentation file convention, with reverse proxy support, error tracking (`capture_exceptions`), and debug mode in development.
- `lib/posthog-server.ts` — A `getPostHogClient()` helper that returns a properly-configured `posthog-node` client (with `flushAt: 1` and `flushInterval: 0` for short-lived server environments).

**Modified files:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites so client-side PostHog requests are less likely to be blocked by ad blockers.
- `app/(login)/actions.ts` — Server-side `posthog.capture()` and `posthog.identify()` calls added to all authentication and account management server actions.
- `app/(dashboard)/layout.tsx` — `posthog.identify()` called client-side in `UserMenu` when SWR loads the current user, and `posthog.reset()` called on sign-out to unlink the session.
- `app/(dashboard)/pricing/page.tsx` — Passes `planName` and `priceId` props to `SubmitButton` for richer checkout tracking.
- `app/(dashboard)/pricing/submit-button.tsx` — `checkout_started` event captured client-side on button click, with plan name and price ID as properties.
- `app/api/stripe/checkout/route.ts` — `subscription_activated` event captured server-side when a Stripe checkout completes successfully.
- `app/api/stripe/webhook/route.ts` — `subscription_updated` and `subscription_cancelled` events captured server-side from Stripe webhook events.

**Environment:**
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set.

---

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates | `app/(login)/actions.ts` |
| `user_signed_up` | New user completes registration | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out | `app/(login)/actions.ts` |
| `invitation_accepted` | User signs up via team invitation | `app/(login)/actions.ts` |
| `account_updated` | User saves changes to name/email | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes password | `app/(login)/actions.ts` |
| `account_deleted` | User soft-deletes their account (churn signal) | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation | `app/(login)/actions.ts` |
| `team_member_removed` | Team member is removed | `app/(login)/actions.ts` |
| `checkout_started` | User clicks "Get Started" on a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_activated` | Stripe checkout completes — subscription stored | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe webhook: subscription status/plan changed | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted | `app/api/stripe/webhook/route.ts` |

---

## Next steps

We've set up a dashboard and insights in PostHog to monitor the key metrics from these events. Here are suggested insights to build in your **"Analytics basics"** dashboard:

1. **Signup to Paid Conversion Funnel** — Create a [Funnel insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS) with steps: `user_signed_up` → `checkout_started` → `subscription_activated`

2. **User Signups Over Time** — Create a [Trends insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS) tracking `user_signed_up` over time

3. **Churn Indicators** — Create a [Trends insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS) tracking `account_deleted` and `subscription_cancelled` together

4. **Team Growth** — Create a [Trends insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS) tracking `team_member_invited` vs `team_member_removed`

5. **Daily Active Users** — Create a [Trends insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS) with unique users count on `user_signed_in`

[Open PostHog dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
