<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Here is a summary of all changes made:

**Client-side initialization** — `instrumentation-client.ts` was created at the project root. PostHog is initialized with a reverse proxy (`/ingest`), exception capture enabled (`capture_exceptions: true`), and debug mode in development.

**Reverse proxy** — `next.config.ts` was updated with rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` pointing to the PostHog US assets and ingestion hosts. `skipTrailingSlashRedirect` was also enabled to support PostHog's trailing-slash API requests.

**Server-side client** — `lib/posthog-server.ts` was created with a singleton `getPostHogClient()` function using `posthog-node` (`flushAt: 1`, `flushInterval: 0` for immediate delivery in serverless handlers).

**User identification** — `components/login.tsx` now calls `posthog.identify()` with the user's database ID and email on successful sign-in or sign-up, and passes `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers to the API routes so client and server events correlate. Server routes (`sign-in.ts`, `sign-up.ts`) call `posthog.identify()` and emit their events using the same user ID.

**Event capture** — 11 events were added across 7 files (see table below).

**Error tracking** — `posthog.captureException()` is called in all relevant `catch` blocks.

**Packages installed** — `posthog-js` and `posthog-node`.

| Event | Description | File |
|-------|-------------|------|
| `sign_in_submitted` | User submits the sign-in form | `components/login.tsx` |
| `sign_up_submitted` | User submits the sign-up form | `components/login.tsx` |
| `checkout_initiated` | User clicks Get Started on a pricing plan | `pages/pricing.tsx` |
| `manage_subscription_clicked` | User opens the Stripe customer portal | `pages/dashboard/index.tsx` |
| `team_member_invited` | Owner invites a new team member | `pages/dashboard/index.tsx` |
| `team_member_removed` | Owner removes a team member | `pages/dashboard/index.tsx` |
| `account_updated` | User saves changes to their account | `pages/dashboard/general.tsx` |
| `user_signed_in` | Server-side: user authenticates via sign-in API | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | Server-side: new account created via sign-up API | `pages/api/auth/sign-up.ts` |
| `subscription_updated` | Server-side: Stripe subscription updated | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: Stripe subscription cancelled | `pages/api/stripe/webhook.ts` |

## Next steps

Explore your new events and build an "Analytics basics" dashboard in PostHog with insights like these:

- [Sign-up trend (sign_up_submitted)](/insights/new#{"insight":"TRENDS","events":[{"id":"sign_up_submitted","name":"sign_up_submitted","type":"events","math":"dau"}]})
- [Sign-up → Checkout conversion funnel](/insights/new#{"insight":"FUNNELS","events":[{"id":"sign_up_submitted"},{"id":"checkout_initiated"}]})
- [Subscription lifecycle (subscription_updated + subscription_cancelled)](/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_updated"},{"id":"subscription_cancelled"}]})
- [Team collaboration (team_member_invited + team_member_removed)](/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_invited"},{"id":"team_member_removed"}]})
- [View your dashboards](/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
