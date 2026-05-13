<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow Astro hybrid marketing site.

## What was added

- **`src/components/posthog.astro`** — Client-side PostHog snippet component using `is:inline` with environment variables. Loaded in `<head>` on every page.
- **`src/lib/posthog-server.ts`** — Singleton `posthog-node` client for server-side event tracking in API routes.
- **`src/layouts/Layout.astro`** — Updated to include the `<PostHog />` component in `<head>`, enabling analytics on all pages.
- **`src/pages/index.astro`** — Tracks `cta_clicked` when users click "Start Free Trial" or "Contact Sales" in the hero section.
- **`src/components/Navigation.astro`** — Tracks `nav_cta_clicked` when users click "Get Started" in the navigation bar.
- **`src/pages/pricing.astro`** — Tracks `pricing_plan_selected` (with `plan` and `plan_price` properties) when users click a pricing plan CTA.
- **`src/pages/contact.astro`** — Tracks `contact_form_submitted` (with `interest` and `has_company` properties) on form submit; captures network errors via `captureException`.
- **`src/pages/api/contact.ts`** — Server-side tracking: `contact_form_received` on success and `contact_form_failed` (with `reason`) on validation errors. Session ID is passed via `X-PostHog-Session-Id` header for client–server correlation.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" or "Contact Sales" in the hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicks a CTA on a pricing plan (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_received` | Contact form submission successfully processed (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed validation (server-side) | `src/pages/api/contact.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights to monitor key user behavior:

1. **Contact Form Conversion Funnel** — Funnel insight: `contact_form_submitted` → `contact_form_received`. Shows the drop-off between client submission and successful server processing.

2. **CTA Clicks by Type** — Trend insight on `cta_clicked` broken down by the `cta` property (`start_free_trial` vs `contact_sales`). Shows which hero CTA resonates more.

3. **Pricing Plan Popularity** — Trend insight on `pricing_plan_selected` broken down by the `plan` property. Shows which plan (Starter, Pro, Enterprise) users click most.

4. **Contact Form Submissions Over Time** — Trend insight on `contact_form_submitted` over time. Tracks lead generation volume.

5. **Nav vs Hero CTA Comparison** — Trend insight comparing `nav_cta_clicked` and `cta_clicked` event counts over time. Shows which entry point drives more engagement.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
