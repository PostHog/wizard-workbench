<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. The following changes were made:

- **Installed** `posthog-js` and `posthog-node` packages
- **Created** `src/components/posthog.astro` — client-side PostHog snippet component using `is:inline` and environment variables
- **Created** `src/lib/posthog-server.ts` — server-side PostHog singleton using `posthog-node`
- **Updated** `src/layouts/Layout.astro` — added the PostHog component to the `<head>` so all pages are instrumented
- **Updated** `src/pages/index.astro` — tracks hero CTA clicks and "Contact Sales" button clicks
- **Updated** `src/pages/pricing.astro` — tracks which pricing plan CTA each visitor clicks
- **Updated** `src/pages/contact.astro` — tracks contact form submissions and errors, passes session/distinct ID to the server
- **Updated** `src/pages/api/contact.ts` — server-side event capture for form received and validation failures, correlated to the client session via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers
- **Created** `.env` — set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" from the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (includes `plan`: starter, pro, or enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_errored` | Contact form submission fails on the client (network or server error) | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully receives and validates a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server rejects a contact form submission due to validation errors | `src/pages/api/contact.ts` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create it in PostHog using the links below:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)
- [CTA clicks trend — track hero engagement over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"cta_clicked","name":"cta_clicked","type":"events","order":0},{"id":"contact_sales_clicked","name":"contact_sales_clicked","type":"events","order":1}]})
- [Pricing plan interest breakdown — see which plan attracts the most clicks](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"pricing_plan_clicked","name":"pricing_plan_clicked","type":"events","order":0}],"breakdown":"plan","breakdown_type":"event"})
- [Contact funnel — from CTA to form submission](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"cta_clicked","name":"cta_clicked","type":"events","order":0},{"id":"contact_form_submitted","name":"contact_form_submitted","type":"events","order":1}]})
- [Contact form error rate](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_form_submitted","name":"contact_form_submitted","type":"events","order":0},{"id":"contact_form_errored","name":"contact_form_errored","type":"events","order":1}]})
- [Server-side form validation failures](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_form_validation_failed","name":"contact_form_validation_failed","type":"events","order":0}],"breakdown":"reason","breakdown_type":"event"})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
