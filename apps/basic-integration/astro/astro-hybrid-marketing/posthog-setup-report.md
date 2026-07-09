<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro hybrid marketing site with PostHog across both client-side interactions and the server-side contact API. It installed `posthog-node`, added a reusable inline PostHog browser snippet component, mounted that snippet in the shared layout, created a singleton server client for API tracking, configured Astro environment variables, instrumented key marketing and lead-generation events, added browser and API error tracking around the contact flow, and created a starter PostHog dashboard with five insights.

| Event | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures when a visitor clicks a primary homepage call to action. | `src/pages/index.astro` |
| `pricing_cta_clicked` | Captures when a visitor clicks a pricing plan call to action. | `src/pages/pricing.astro` |
| `contact_sales_cta_clicked` | Captures when a visitor clicks a contact sales call to action. | `src/pages/pricing.astro` |
| `navigation_cta_clicked` | Captures when a visitor clicks the main navigation call to action. | `src/components/Navigation.astro` |
| `footer_link_clicked` | Captures when a visitor clicks a footer navigation link. | `src/components/Footer.astro` |
| `contact_form_started` | Captures when a visitor first interacts with the contact form. | `src/pages/contact.astro` |
| `contact_form_submitted` | Captures when the contact form submission succeeds in the browser. | `src/pages/contact.astro` |
| `contact_form_submission_failed` | Captures when the contact form submission fails in the browser. | `src/pages/contact.astro` |
| `contact_request_received` | Captures when the server receives a valid contact request. | `src/pages/api/contact.ts` |
| `contact_request_rejected` | Captures when the server rejects an invalid contact request. | `src/pages/api/contact.ts` |
| `contact_request_completed` | Captures when the server completes contact request processing successfully. | `src/pages/api/contact.ts` |
| `contact_request_failed` | Captures when the server encounters an unexpected error processing a contact request. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825330
- Insight: Homepage CTA clicks (wizard) — https://us.posthog.com/project/483112/insights/KVSXcuO3
- Insight: Pricing CTA clicks by plan (wizard) — https://us.posthog.com/project/483112/insights/N65HdriA
- Insight: Contact funnel (wizard) — https://us.posthog.com/project/483112/insights/dhHib7vf
- Insight: Contact submission failures (wizard) — https://us.posthog.com/project/483112/insights/43PZOdzo
- Insight: Server contact outcomes (wizard) — https://us.posthog.com/project/483112/insights/POw9BNHG

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
