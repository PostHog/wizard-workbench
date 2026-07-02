# PostHog post-wizard report

The wizard added PostHog instrumentation to key authentication, invitation, billing webhook, and dashboard view flows. Changes were implemented with minimal edits to existing code and by following the Next.js App Router example provided by the PostHog integration skill. Server-side PostHog events use a lightweight helper `lib/posthog-server.ts` (posthog-node). Client-side identification and capture rely on existing client components where appropriate.

| Event name | Description | File |
|------------|-------------|------|
| user_signed_up | Triggered when a new user completes sign up. | app/(login)/actions.ts |
| user_signed_in | Triggered when a user signs in successfully. | app/(login)/actions.ts |
| checkout_initiated | Triggered when a user begins the checkout flow. | app/(login)/actions.ts |
| subscription_webhook_received | Server-side event when Stripe subscription webhook is processed. | app/api/stripe/webhook/route.ts |
| user_viewed_dashboard | User lands on the main dashboard page. | app/(dashboard)/dashboard/page.tsx |
| team_member_invited | Triggered when a team member invitation is sent. | app/(login)/actions.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard) — https://us.posthog.com/project/228144/dashboard/1793086
- Insights:
  - Sign-ins count (wizard) — https://us.posthog.com/project/228144/insights/RHcZUchg
  - Signups count (wizard) — https://us.posthog.com/project/228144/insights/COqfQDRX
  - Invites sent (wizard) — https://us.posthog.com/project/228144/insights/LUkefCjN
  - Subscription webhooks (wizard) — https://us.posthog.com/project/228144/insights/0xzVjzqq

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.


### Agent skill

An agent skill folder was added in `.claude/skills/integration-nextjs-app-router` to provide guidance and references for this integration.