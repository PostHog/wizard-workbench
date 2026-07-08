# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI marketing site. The integration adds client-side analytics via the PostHog web snippet and server-side tracking via `posthog-node` in the contact form API route.

**New files created:**
- `src/components/posthog.astro` — PostHog web snippet component (injected into the layout)
- `src/lib/posthog-server.ts` — Server-side PostHog client singleton

**Files modified:**
- `src/layouts/Layout.astro` — Imports and renders `<PostHog />` in `<head>` for all pages
- `src/pages/index.astro` — Tracks hero CTA and "Contact Sales" clicks
- `src/pages/pricing.astro` — Tracks pricing plan button clicks with plan name
- `src/pages/contact.astro` — Identifies the lead and captures form submission on success; sends session ID header to API; captures exceptions
- `src/pages/api/contact.ts` — Captures server-side `contact_form_lead_captured` event, calls `identify` with name/company as person properties, and captures exceptions

**Environment variables added to `.env`:**
- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

## Events

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA on the homepage hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" button on the homepage hero section. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan button on the pricing page (property: `plan`). | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form on the contact page; fires after successful API response (property: `interest`). | `src/pages/contact.astro` |
| `contact_form_lead_captured` | Contact form submission successfully processed server-side (properties: `interest`, `has_company`, `source`). | `src/pages/api/contact.ts` |

## Next steps

We've built a dashboard and insights to monitor user behavior from day one:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816750)
- [CTA engagement over time](https://us.posthog.com/project/483112/insights/rZzZJM31)
- [Pricing plan interest by plan](https://us.posthog.com/project/483112/insights/uf7Eqxt8)
- [Contact form submissions over time](https://us.posthog.com/project/483112/insights/BnWBnCHR)
- [Contact form conversion funnel](https://us.posthog.com/project/483112/insights/9HbygsZP)
- [Lead interest area breakdown](https://us.posthog.com/project/483112/insights/vMy0q7XM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
