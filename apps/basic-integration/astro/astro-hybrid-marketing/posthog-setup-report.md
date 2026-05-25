<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI Astro hybrid marketing site. Here's a summary of everything that was added:

- **`src/components/posthog.astro`** — New client-side PostHog initialization component using the web snippet with `is:inline` to prevent Astro from processing it. All credentials are loaded from environment variables.
- **`src/lib/posthog-server.ts`** — New server-side PostHog singleton using `posthog-node`. A single client instance is reused across API route invocations.
- **`src/layouts/Layout.astro`** — Updated to import and render the `PostHog` component inside `<head>`, enabling analytics on every page.
- **`src/pages/index.astro`** — Added click tracking for the "Start Free Trial" and "Contact Sales" hero CTAs.
- **`src/pages/pricing.astro`** — Added click tracking for each pricing plan button (Starter, Pro, Enterprise).
- **`src/pages/contact.astro`** — Added form submission success and failure tracking, plus exception capture on network errors. PostHog session and distinct IDs are forwarded to the server via request headers.
- **`src/pages/api/contact.ts`** — Added server-side `contact_form_received` event via `posthog-node`, correlated to the client session using `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" or "Get Started" hero CTA | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" hero button | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form submitted successfully on the client | `src/pages/contact.astro` |
| `contact_form_failed` | Contact form submission failed (server error or network error) | `src/pages/contact.astro` |
| `contact_form_received` | Server-side API route received and validated a contact form | `src/pages/api/contact.ts` |

## Next steps

Visit your [PostHog project](/insights) to explore the events being captured. Suggested insights to build in the [dashboard](/dashboard) area:

- **CTA conversion trend** — Trends chart for `cta_clicked` and `contact_sales_clicked` over time
- **Pricing plan interest** — Trends chart for `pricing_plan_clicked` broken down by `plan` property
- **Contact funnel** — Funnel from `pricing_plan_clicked` (Enterprise) → `contact_form_submitted`
- **Form success rate** — Formula insight: `contact_form_submitted / (contact_form_submitted + contact_form_failed) * 100`
- **Server-side receipt confirmation** — Trends chart comparing `contact_form_submitted` vs `contact_form_received` to detect drop-off between client and server

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
