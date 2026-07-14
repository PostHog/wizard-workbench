# PostHog post-wizard report

The wizard has completed a deep integration of this Astro hybrid marketing site with PostHog across client-side CTAs, pricing interactions, and the server-backed contact flow. The integration adds the PostHog browser snippet through a reusable Astro component included in the shared layout, configures a singleton `posthog-node` client for API routes, wires environment variables through Astro public env keys, captures key marketing and lead-generation events, identifies contact-form users on both client and server, and flushes server-side events before the API response returns. A wizard dashboard and five saved insights were also created in PostHog for the new events.

| Event name | Description | File |
| --- | --- | --- |
| `hero_cta_clicked` | Captures clicks on the primary conversion CTA from the homepage hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | Captures clicks on contact-focused CTAs that move visitors toward speaking with sales. | `src/pages/index.astro` |
| `navigation_cta_clicked` | Captures clicks on the persistent navigation CTA to measure high-intent interest. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | Captures selection of a pricing plan CTA to measure plan-level demand. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Captures successful contact form submissions on the client for lead generation analysis. | `src/pages/contact.astro` |
| `contact_form_submission_recorded` | Captures successful contact form submissions on the server after validation passes. | `src/pages/api/contact.ts` |
| `contact_form_submission_failed` | Captures validation or server failures for contact form submissions on the server. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846662)
- [Homepage CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/k0nBGPb8)
- [Pricing plan selections (wizard)](https://us.posthog.com/project/483112/insights/A9omYJhQ)
- [Lead submissions (wizard)](https://us.posthog.com/project/483112/insights/EVwE5y9x)
- [CTA to lead funnel (wizard)](https://us.posthog.com/project/483112/insights/XIbvyaeo)
- [Contact form outcomes (wizard)](https://us.posthog.com/project/483112/insights/kHLefpqr)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or an equivalent bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` if this marketing site later adds authenticated or persisted user sessions beyond the contact flow.

### Agent skill

An agent skill folder was left in the project at `.claude/skills/integration-astro-hybrid`. This can be reused for further agent-driven PostHog work with up-to-date Astro integration context.
