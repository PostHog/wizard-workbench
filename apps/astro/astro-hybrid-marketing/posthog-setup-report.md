<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using `is:inline` and `define:vars` to safely inject environment variables. Loaded on every page via the layout.
- **`src/lib/posthog-server.ts`** (new): Singleton `getPostHogServer()` function that returns a shared `posthog-node` client for server-side API routes.
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` in the `<head>` so all pages are tracked automatically.
- **`src/pages/index.astro`** (edited): Tracks `cta_clicked` when users click the "Start Free Trial" or "Contact Sales" hero buttons, with `label` and `location` properties.
- **`src/pages/pricing.astro`** (edited): Tracks `pricing_plan_clicked` for each plan CTA (Starter, Pro, Enterprise) with `plan` and `cta_label` properties.
- **`src/pages/contact.astro`** (edited): Tracks `contact_form_submitted` on successful form submission with `interest` and `has_company` properties. Captures exceptions on network and server errors. Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the server API for session correlation.
- **`src/pages/api/contact.ts`** (edited): Tracks `contact_form_received` server-side using `posthog-node`, correlating the session via the headers passed from the client.
- **`.env`** (updated): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` added.
- **`posthog-node`** installed as a dependency.

## Events

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked a hero CTA button (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Client-side: user successfully submitted the contact form | `src/pages/contact.astro` |
| `contact_form_received` | Server-side: API route received and validated a contact form submission | `src/pages/api/contact.ts` |

## Next steps

To monitor user behavior, create the following insights in your PostHog project under **Insights**:

1. **CTA Click Trends** — Trends chart for `cta_clicked`, broken down by `label` to compare "Start Free Trial" vs "Contact Sales" clicks over time.
2. **Pricing Plan Interest** — Trends chart for `pricing_plan_clicked`, broken down by `plan` to see which tier (Starter, Pro, Enterprise) attracts the most interest.
3. **Contact Form Conversion Funnel** — Funnel: `cta_clicked` (Contact Sales) → `contact_form_submitted` → `contact_form_received` to measure drop-off.
4. **Contact Form Submissions Over Time** — Trends chart for `contact_form_received`, broken down by `interest` to see which inquiry type (demo, pricing, enterprise, etc.) is most common.
5. **Contact Form Interest Breakdown** — Bar chart for `contact_form_received` grouped by `interest` property to identify the most popular contact reason.

Add these insights to a **"Analytics basics"** dashboard for a single view of key marketing funnel metrics.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
