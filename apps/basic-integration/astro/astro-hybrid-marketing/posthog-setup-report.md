# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into NeuralFlow AI, a hybrid Astro marketing site. The integration covers client-side event tracking via the PostHog JS snippet across all pages, a reusable `posthog.astro` component mounted in the shared layout, server-side tracking in the contact API route via `posthog-node`, and session correlation between client and server using `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary 'Start Free Trial' CTA button on the homepage hero. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the homepage hero, indicating high purchase intent. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a 'Get Started' or 'Start Free Trial' button on a specific pricing plan card. | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | User clicked 'Contact Sales' on the Enterprise pricing card, indicating enterprise purchase intent. | `src/pages/pricing.astro` |
| `contact_form_started` | User began filling out the contact form by focusing on any form field. | `src/pages/contact.astro` |
| `contact_form_submitted` | User submitted the contact form successfully on the client side. | `src/pages/contact.astro` |
| `contact_form_error` | An error occurred when the user submitted the contact form (client-side network or API error). | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully processed and accepted a contact form submission. | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server rejected a contact form submission due to missing or invalid fields. | `src/pages/api/contact.ts` |
| `contact_form_server_error` | An unexpected server error occurred while processing a contact form submission. | `src/pages/api/contact.ts` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar. | `src/components/Navigation.astro` |

## Files created or modified

- **Created** `src/components/posthog.astro` — PostHog JS snippet with `define:vars` for env vars, using `is:inline`
- **Created** `src/lib/posthog-server.ts` — `posthog-node` singleton for server-side tracking
- **Modified** `src/layouts/Layout.astro` — imports and renders `<PostHog />` in `<head>`
- **Modified** `src/pages/index.astro` — CTA and Contact Sales click events
- **Modified** `src/pages/pricing.astro` — plan selection and enterprise contact events
- **Modified** `src/pages/contact.astro` — form started, submitted, and error events with session/distinct ID forwarding
- **Modified** `src/pages/api/contact.ts` — server-side `contact_form_received`, `contact_form_validation_failed`, and `contact_form_server_error` events
- **Modified** `src/components/Navigation.astro` — nav CTA click event

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793435)
- [Contact form conversion funnel](https://us.posthog.com/project/483112/insights/wN1kkCrH)
- [CTA clicks over time](https://us.posthog.com/project/483112/insights/r5GIz5tk)
- [Pricing plan interest by plan](https://us.posthog.com/project/483112/insights/hjEio75L)
- [Contact form submissions (total)](https://us.posthog.com/project/483112/insights/sOIQEdYh)
- [Contact form error rate](https://us.posthog.com/project/483112/insights/V8xnPUJY)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
