<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client-side initialization was added with `instrumentation-client.ts`, a server-side PostHog helper was added for Node captures, authenticated users are now identified in the root layout, and targeted product analytics plus error capture were added around authentication, account management, team management, checkout, and Stripe webhook flows. A reverse proxy rewrite was also added in Next.js config so browser-side requests route through `/ingest`.

| Event name | Description | File |
| --- | --- | --- |
| `checkout_started` | Captures when a signed-in user starts a checkout flow for a pricing plan. | `lib/payments/actions.ts` |
| `customer_portal_opened` | Captures when a signed-in user opens the Stripe customer portal to manage billing. | `lib/payments/actions.ts` |
| `user_signed_in` | Captures when a user successfully signs in to the application. | `app/(login)/actions.ts` |
| `user_signed_up` | Captures when a new user account is created successfully. | `app/(login)/actions.ts` |
| `user_signed_out` | Captures when an authenticated user signs out. | `app/(login)/actions.ts` |
| `account_updated` | Captures when a user updates their account profile details. | `app/(login)/actions.ts` |
| `password_updated` | Captures when a user successfully changes their password. | `app/(login)/actions.ts` |
| `account_deleted` | Captures when a user deletes their account. | `app/(login)/actions.ts` |
| `team_member_invited` | Captures when a team owner sends a new team invitation. | `app/(login)/actions.ts` |
| `team_member_removed` | Captures when a team member is removed from a workspace. | `app/(login)/actions.ts` |
| `checkout_completed` | Captures when a Stripe checkout session completes and a subscription is attached to a team. | `app/api/stripe/checkout/route.ts` |
| `subscription_status_changed` | Captures when Stripe sends a subscription update or deletion webhook. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831212)
- [Signups over time (wizard)](https://us.posthog.com/project/483112/insights/GWKRkFGh)
- [Checkout starts over time (wizard)](https://us.posthog.com/project/483112/insights/rt3fMQb7)
- [Completed checkouts (wizard)](https://us.posthog.com/project/483112/insights/85p52fLk)
- [Subscription status changes (wizard)](https://us.posthog.com/project/483112/insights/370BmybA)
- [Signup to checkout funnel (wizard)](https://us.posthog.com/project/483112/insights/19gQ1FeX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
