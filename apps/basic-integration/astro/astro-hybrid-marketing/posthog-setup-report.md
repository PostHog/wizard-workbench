<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Client-side tracking was added via a PostHog web snippet component (`src/components/posthog.astro`) imported into the shared layout, covering all pages automatically. Server-side tracking via `posthog-node` was implemented in the contact API route using a singleton client (`src/lib/posthog-server.ts`). User identification is performed on contact form submission — the visitor's email becomes their distinct ID and person properties (name, email, company) are set via `identify()` on both client and server. Session IDs are forwarded from client to server via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers so client and server events correlate in the same session.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the Start Free Trial CTA on the homepage hero | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the Contact Sales button on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA on the pricing page (property: `plan`) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form successfully submitted client-side (properties: `interest`, `has_company`) | `src/pages/contact.astro` |
| `contact_form_received` | Server-side confirmation the contact API processed the form (properties: `interest`, `has_company`, `source`) | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818067)
- [CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/nxxeWmih)
- [Pricing Plan CTA Clicks by Plan](https://us.posthog.com/project/483112/insights/AloemwtF)
- [Contact Form Conversion Funnel](https://us.posthog.com/project/483112/insights/FfYgXUeb)
- [Contact Form Submissions by Interest](https://us.posthog.com/project/483112/insights/QMEWrfr7)
- [Server-side Contact Form Received](https://us.posthog.com/project/483112/insights/lTZVsNpP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh contact form submit can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
