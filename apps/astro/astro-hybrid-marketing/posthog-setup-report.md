<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **NeuralFlow AI** Astro hybrid application. Here is a summary of all changes made:

### New files created

- **`src/components/posthog.astro`** — Client-side PostHog initialisation snippet using `is:inline` and `define:vars` to inject environment variables safely (no hardcoded keys).
- **`src/lib/posthog-server.ts`** — Server-side PostHog singleton using `posthog-node`, ensuring a single client instance is reused across all API route invocations.

### Files edited

- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>`, enabling analytics on every page of the site.
- **`src/pages/index.astro`** — Added inline script capturing `cta_clicked` and `contact_sales_clicked` events on the hero section buttons.
- **`src/pages/pricing.astro`** — Added inline script capturing `pricing_plan_clicked` (with `plan` and `price` properties) on all three pricing plan CTAs.
- **`src/pages/contact.astro`** — Updated the form submission handler to:
  - Identify users via `posthog.identify()` with their email, name, and company after a successful submission.
  - Capture `contact_form_submitted` on success.
  - Capture `contact_form_error` on failure, plus `captureException` for unexpected errors.
  - Forward `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API for server-side correlation.
- **`src/pages/api/contact.ts`** — Added server-side tracking using `posthog-node`:
  - `contact_form_received` on successful form processing (most reliable lead event).
  - `contact_form_validation_failed` on bad input, with a `reason` property.
  - `posthog.identify()` to attach user properties (name, email, company) to the PostHog profile.

### Package installed

- **`posthog-node`** — Server-side analytics SDK for API route tracking.

### Environment variables set

| Variable | Description |
|---|---|
| `PUBLIC_POSTHOG_KEY` | PostHog project API key (client + server) |
| `PUBLIC_POSTHOG_HOST` | PostHog ingestion host |

---

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the "Start Free Trial" hero CTA — top of conversion funnel | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the homepage hero — high-intent sales signal | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter / Pro / Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side confirmation) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission fails (network or server error) | `src/pages/contact.astro` |
| `contact_form_received` | Server-side: API confirms a valid contact form lead was received | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server-side: API rejects a form submission due to missing/invalid fields | `src/pages/api/contact.ts` |

---

## Next steps

We've prepared an **"Analytics basics"** dashboard for your PostHog project. You can create it with the insights below by visiting your PostHog project:

### Dashboard

➡️ [Open PostHog Dashboards — Project 238460](https://us.posthog.com/project/238460/dashboards)

Create a new dashboard named **"Analytics basics"** and add the following insights:

### Recommended insights

1. **Lead Generation Funnel** — Conversion funnel from homepage CTAs → pricing page → contact form
   - [Create Funnel insight](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS) with steps: `cta_clicked` → `pricing_plan_clicked` → `contact_form_submitted`

2. **CTA Click Trends** — Track `cta_clicked` and `contact_sales_clicked` over time
   - [Create Trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

3. **Pricing Plan Popularity** — Breakdown of `pricing_plan_clicked` by `plan` property
   - [Create Trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS) with breakdown on `plan`

4. **Contact Form Success Rate** — Compare `contact_form_submitted` vs `contact_form_error`
   - [Create Trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

5. **Server-Side Lead Confirmation** — Track `contact_form_received` as the most reliable lead count
   - [Create Trends insight](https://us.posthog.com/project/238460/insights/new?insight=TRENDS)

---

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
