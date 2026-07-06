<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client and server SDKs were added, browser initialization was introduced through a shared helper, a reverse proxy was added in the server hook for `/ingest`, session replay support was enabled with `paths.relative = false`, and new product and revenue-related events were instrumented across pricing, contact, auth, and billing flows. Environment variables were written to `.env`, and a new PostHog dashboard with five insights was created for the tracked flows.

| Event name | Description | File |
| --- | --- | --- |
| `contact_request_submitted` | Captures successful contact form submissions from the marketing site. | `src/routes/(marketing)/contact_us/+page.server.ts` |
| `checkout_started` | Captures when an authenticated user starts a Stripe checkout for a paid plan. | `src/routes/(admin)/account/subscribe/[slug]/+page.server.ts` |
| `billing_portal_opened` | Captures when an authenticated user opens the Stripe billing portal. | `src/routes/(admin)/account/(menu)/billing/manage/+page.server.ts` |
| `pricing_plan_selected` | Captures when a visitor clicks a plan call-to-action from pricing components. | `src/routes/(marketing)/pricing/pricing_module.svelte` |
| `user_signed_in` | Captures when a signed-in session is observed in the authenticated app layout. | `src/routes/(admin)/account/+layout.svelte` |
| `user_signed_out` | Captures when a signed-in user signs out from the app. | `src/routes/(admin)/account/sign_out/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807716
- Insight: Pricing plan selections (wizard) — https://us.posthog.com/project/483112/insights/gbO6AHU3
- Insight: Contact requests submitted (wizard) — https://us.posthog.com/project/483112/insights/koyS7mex
- Insight: Billing operations (wizard) — https://us.posthog.com/project/483112/insights/PSPgRHpk
- Insight: Signed in to checkout funnel (wizard) — https://us.posthog.com/project/483112/insights/SHNVzeQ9
- Insight: Signed in vs signed out (wizard) — https://us.posthog.com/project/483112/insights/3ciBwxLi

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.
- [ ] If account settings actions also need analytics, add safe server-side events there without sending PII in capture properties.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
