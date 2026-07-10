<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). The integration includes a client-side PostHog snippet loaded via a reusable component, a server-side posthog-node singleton for API route tracking, and event capture across all key conversion touchpoints on both client and server.

**Files created:**
- `src/components/posthog.astro` — Client-side PostHog web snippet using `is:inline` and `define:vars` to safely inject environment variables.
- `src/lib/posthog-server.ts` — Singleton factory for the posthog-node server-side client.
- `.env` — PostHog token and host added as `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

**Files edited:**
- `src/layouts/Layout.astro` — Imported and mounted `<PostHog />` in `<head>` so all pages get analytics.
- `src/pages/index.astro` — Added IDs and click listeners to hero CTAs for `start_free_trial_clicked` and `contact_sales_clicked`.
- `src/pages/features.astro` — Added `features_page_viewed` capture on page load.
- `src/pages/pricing.astro` — Added `pricing_page_viewed` on load; `pricing_plan_cta_clicked` (with `plan` property) on each plan CTA.
- `src/components/Navigation.astro` — Added `nav_get_started_clicked` on the nav CTA.
- `src/pages/contact.astro` — Extended the fetch handler to pass `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers; captures `contact_form_submitted` on success and `contact_form_failed` on error.
- `src/pages/api/contact.ts` — Imported the posthog-node singleton; captures `contact_form_received` on success and `contact_form_error` on server exceptions, correlating with the client session via headers.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the 'Start Free Trial' button in the homepage hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' button in the homepage hero section. | `src/pages/index.astro` |
| `features_page_viewed` | User lands on the Features page, indicating interest in product capabilities. | `src/pages/features.astro` |
| `pricing_page_viewed` | User lands on the Pricing page, a high-intent conversion signal. | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks a pricing plan CTA button, with the plan name as a property. | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA button in the main navigation. | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form was successfully submitted and the server returned a success response. | `src/pages/contact.astro` |
| `contact_form_failed` | Contact form submission failed due to a validation or network error on the client side. | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully processed a contact form submission. | `src/pages/api/contact.ts` |
| `contact_form_error` | Server encountered an error while processing a contact form submission. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829012)
- [Contact form conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/TlOco4gZ) — Funnel from pricing page view to contact form submission
- [Pricing plan CTA clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/WQlxHRwU) — Bar chart broken down by plan (starter/pro/enterprise)
- [Hero CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/KY7qaXCO) — Trend line comparing "Start Free Trial" vs "Contact Sales"
- [Contact form submissions (wizard)](https://us.posthog.com/project/483112/insights/MBWu3SvC) — Server-side vs client-side form submission counts
- [High-intent page views (wizard)](https://us.posthog.com/project/483112/insights/yVbsjZUO) — Features and Pricing page view trends

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
