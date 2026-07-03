<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog into this Next.js App Router project with client and server tracking, environment configuration, and a dashboard for key flows. Client-side initialization is handled via instrumentation-client.ts. Server-side usage is available via a lightweight wrapper in lib/posthog-server.ts. Key UI actions and server-side lifecycle events are captured with clear, snake_case names.

| Event name | Description | File |
| --- | --- | --- |
| pricing_viewed | User viewed the pricing page to compare plans. | app/(dashboard)/pricing/page.tsx |
| checkout_started | User initiated checkout from a specific plan. | app/(dashboard)/pricing/submit-button.tsx |
| signup_submitted | Visitor submitted the sign up form. | app/(login)/login.tsx |
| signin_submitted | User submitted the sign in form. | app/(login)/login.tsx |
| subscription_activated | Team subscription became active after Stripe checkout success. | app/api/stripe/checkout/route.ts |
| subscription_updated | Stripe webhook reported a subscription status change. | app/api/stripe/webhook/route.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard)
- Auth conversion funnel (wizard)
- Checkout starts over time (wizard)
- Auth submissions by type (wizard)
- Subscription lifecycle events (wizard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls identify — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
