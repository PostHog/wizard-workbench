# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS project. PostHog is initialized client-side via `instrumentation-client.ts` using a reverse proxy (rewrites in `next.config.ts`) so analytics requests flow through your own domain. A server-side PostHog client (`lib/posthog-server.ts`) handles subscription webhook events. Users are identified by email on sign-in and sign-up, and their identity is reset on sign-out. Error tracking (`captureException`) is wired into every critical catch block.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account | `components/login.tsx` |
| `user_signed_in` | Existing user successfully signs in | `components/login.tsx` |
| `user_signed_out` | User signs out (PostHog identity reset after) | `components/header.tsx` |
| `checkout_started` | User submits a pricing plan and checkout begins | `pages/pricing.tsx` |
| `team_member_invited` | A team invitation is sent successfully | `pages/dashboard/index.tsx` |
| `team_member_removed` | A team member is removed | `pages/dashboard/index.tsx` |
| `account_updated` | User updates their name or email | `pages/dashboard/general.tsx` |
| `subscription_management_opened` | User opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `subscription_updated` | Stripe webhook: subscription status changed | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted | `pages/api/stripe/webhook.ts` |

## Next steps

Create a dashboard to monitor user behavior in PostHog — the events above are ready to query as soon as users interact with the app. Suggested insights to add:

- **Sign-up → Checkout funnel**: Funnel from `user_signed_up` → `checkout_started` to measure conversion from registration to paid intent.
- **Sign-in trend**: Trends chart of `user_signed_in` over time to track active user engagement.
- **Subscription outcomes**: Trend comparing `subscription_updated` vs `subscription_cancelled` to watch churn.
- **Team collaboration**: Trend of `team_member_invited` to gauge virality/collaboration adoption.
- **Account updates**: Trend of `account_updated` as a proxy for active profile engagement.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (and any bootstrap/onboarding scripts) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog Error Tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on sign-in and sign-up, but users who return with an existing session (loaded from cookie) are not re-identified on page load. Consider adding an `identify` call in `_app.tsx` when a session is detected.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
