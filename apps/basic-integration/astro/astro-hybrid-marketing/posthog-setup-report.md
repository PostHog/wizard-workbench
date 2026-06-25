# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Changes include:

- **`src/components/posthog.astro`** (new): Client-side PostHog initialization snippet using `is:inline` to prevent Astro TypeScript processing. Reads API key and host from environment variables.
- **`src/lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event tracking in API routes.
- **`src/env.d.ts`** (new): Global TypeScript declaration for `window.posthog` so TypeScript-processed scripts can safely access it.
- **`src/layouts/Layout.astro`** (edited): Imports and renders the PostHog component in `<head>` so all pages get client-side tracking automatically.
- **`src/pages/index.astro`** (edited): Tracks `free_trial_started` and `contact_sales_clicked` on hero CTA button clicks.
- **`src/pages/pricing.astro`** (edited): Tracks `pricing_page_viewed` on load and `pricing_plan_selected` (with `plan` property) when a pricing CTA is clicked.
- **`src/pages/contact.astro`** (edited): Tracks `contact_form_submitted` on form submit; passes PostHog session ID and distinct ID headers to the API; calls `posthog.identify()` with email and name on successful submission; captures exceptions on network errors.
- **`src/pages/api/contact.ts`** (edited): Server-side tracking of `contact_form_succeeded` and `contact_form_failed` events via `posthog-node`, with session correlation via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.

| Event name | Description | File |
|---|---|---|
| `pricing_page_viewed` | User viewed the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `free_trial_started` | User clicked the 'Start Free Trial' CTA on the home page hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the home page. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA on the pricing page to select a specific plan. | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form on the client side. | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission was successfully processed on the server. | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed validation or encountered a server error. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761075)
- [Conversion funnel: Pricing to Contact](https://us.posthog.com/project/483112/insights/9588436)
- [Free Trial CTA clicks over time](https://us.posthog.com/project/483112/insights/9588437)
- [Contact Sales clicks over time](https://us.posthog.com/project/483112/insights/9588438)
- [Pricing plan selection breakdown](https://us.posthog.com/project/483112/insights/9588441)
- [Contact form success vs failure rate](https://us.posthog.com/project/483112/insights/9588445)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the contact form only identifies on first successful submission; returning users who don't resubmit the form will remain on anonymous distinct IDs until they do.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
