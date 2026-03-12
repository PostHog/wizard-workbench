<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** (created): Client-side PostHog initialization snippet using the `is:inline` directive to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** (updated): Imports and renders `<PostHog />` inside `<head>` so all pages using the layout are automatically instrumented.
- **`src/lib/posthog-server.ts`** (created): Singleton pattern for the `posthog-node` server-side client, used by API routes to capture server-side events.
- **`src/pages/api/contact.ts`** (updated): Captures `contact_form_received` server-side after a successful form submission. Reads `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers passed from the client to correlate sessions.
- **`src/pages/contact.astro`** (updated): Captures `contact_form_submitted` on success and `contact_form_submit_failed` on error. Passes PostHog session ID and distinct ID as headers to the API route. Calls `captureException` on network errors.
- **`src/pages/index.astro`** (updated): Captures `cta_clicked` for the "Start Free Trial" and "Contact Sales" hero buttons.
- **`src/pages/pricing.astro`** (updated): Captures `pricing_plan_clicked` (with `plan` property) for Starter and Pro plan buttons. Captures `contact_sales_clicked` for the Enterprise "Contact Sales" button.
- **`src/components/Navigation.astro`** (updated): Captures `nav_cta_clicked` for the "Get Started" navigation CTA button.
- **`.env`** (created): Contains `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a primary or secondary CTA button (Start Free Trial, Contact Sales) | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan button (Starter or Pro) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the Contact Sales button from the Enterprise pricing card | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_submit_failed` | Contact form submission fails (validation error or network error) | `src/pages/contact.astro` |
| `contact_form_received` | Server-side: contact form data received and processed by the API route | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | User clicks the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/661406)
- **CTA Conversion Funnel** — `cta_clicked → contact_form_submitted → contact_form_received`: [View insight](https://us.posthog.com/project/2/insights/yu0p39ix)
- **Pricing Plan Clicks** — breakdown of `pricing_plan_clicked` by plan: [View insight](https://us.posthog.com/project/2/insights/aoxuelaf)
- **Contact Form Submission Rate** — `contact_form_submitted` vs `contact_form_submit_failed` over time: [View insight](https://us.posthog.com/project/2/insights/zsrq7a94)
- **CTA Clicks by Location** — `cta_clicked` and `nav_cta_clicked` by location: [View insight](https://us.posthog.com/project/2/insights/s41iw9m4)
- **Contact Interest Breakdown** — `contact_form_submitted` broken down by interest: [View insight](https://us.posthog.com/project/2/insights/qhswdx1s)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
