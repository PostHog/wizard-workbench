<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router SaaS starter. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A shared server-side PostHog client (`lib/posthog-server.ts`) is used across server actions and API routes. Users are identified on every dashboard load via `posthog.identify()` in the layout, and `posthog.reset()` is called on sign-out. Twelve events covering the full user lifecycle — from sign-up through subscription management to account deletion — are captured across both client and server.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticates with their email and password. | `app/(login)/actions.ts` |
| `user_signed_up` | A new user account is created, either directly or via team invitation. | `app/(login)/actions.ts` |
| `user_signed_out` | User ends their session by signing out. | `app/(login)/actions.ts` |
| `checkout_started` | User initiates a Stripe checkout session to subscribe to a plan. | `lib/payments/actions.ts` |
| `subscription_activated` | Stripe checkout completes successfully and the team subscription is activated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | A Stripe webhook signals a subscription status change (upgrade, renewal, or cancellation). | `app/api/stripe/webhook/route.ts` |
| `account_updated` | User updates their account name or email in General Settings. | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password in Security Settings. | `app/(login)/actions.ts` |
| `account_deleted` | User permanently deletes their account after password confirmation. | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner sends an invitation to a new member with a specified role. | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes an existing member from the team. | `app/(login)/actions.ts` |
| `manage_subscription_clicked` | User opens the Stripe customer portal to manage their subscription. | `lib/payments/actions.ts` |

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog with the following insights:

1. **Sign-up & sign-in trend** — Trends chart for `user_signed_up` and `user_signed_in` over time.
2. **Checkout conversion funnel** — Funnel: `user_signed_up` → `checkout_started` → `subscription_activated`.
3. **Subscription health** — Trend of `subscription_activated` vs `subscription_updated` (showing status breakdown).
4. **Churn signal** — Trend of `account_deleted` and `manage_subscription_clicked` over time.
5. **Team growth** — Trend of `team_member_invited` and `team_member_removed` over time.

[PostHog Project](https://us.posthog.com/project/2)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
