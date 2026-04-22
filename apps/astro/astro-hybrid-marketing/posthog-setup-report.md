<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your NeuralFlow AI Astro hybrid marketing site. Here's a summary of what was added:

- **`src/components/posthog.astro`** — New PostHog client-side snippet component using `is:inline` and `define:vars` to inject environment variables safely. Initializes PostHog in every page via the shared layout.
- **`src/lib/posthog-server.ts`** — New singleton for the `posthog-node` server-side client. Used by API routes to track events server-side without creating multiple client instances.
- **`src/layouts/Layout.astro`** — Updated to import and render `<PostHog />` in the `<head>`, enabling analytics on every page.
- **`src/pages/index.astro`** — Added click tracking for the "Start Free Trial" and "Contact Sales" hero CTAs.
- **`src/pages/pricing.astro`** — Added `pricing_plan_selected` tracking on each plan's CTA button, including the plan name and price as properties.
- **`src/pages/contact.astro`** — Added `contact_form_submitted` client-side event (with interest and company properties) and session/distinct ID header forwarding to the API for session correlation.
- **`src/pages/api/contact.ts`** — Added server-side `contact_form_submission_succeeded` and `contact_form_submission_failed` events using `posthog-node`, including session ID and distinct ID correlation from the client.

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks "Start Free Trial" CTA on the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" CTA on the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on a specific pricing plan (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (client-side, before API call) | `src/pages/contact.astro` |
| `contact_form_submission_succeeded` | Server-side: contact form processed successfully | `src/pages/api/contact.ts` |
| `contact_form_submission_failed` | Server-side: contact form failed validation or hit a server error | `src/pages/api/contact.ts` |

## Next steps

Visit your PostHog project to explore these events and build insights:

- **[PostHog Project Dashboard](https://us.i.posthog.com/project/2/dashboard)** — View all dashboards for your project.
- **Conversion funnel** — Create a funnel from `pricing_plan_selected` → `contact_form_submitted` → `contact_form_submission_succeeded` to measure lead conversion.
- **CTA performance** — Use a trends insight to compare `start_free_trial_clicked` vs `contact_sales_clicked` click rates over time.
- **Plan popularity** — Break down `pricing_plan_selected` by the `plan` property to see which tier attracts the most interest.
- **Form success rate** — Create a funnel from `contact_form_submitted` → `contact_form_submission_succeeded` to track form completion vs. failure.
- **Lead volume** — Trend chart for `contact_form_submission_succeeded` to monitor inbound lead growth over time.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
