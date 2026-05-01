<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Astro hybrid marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog client-side snippet component using `is:inline` to prevent Astro processing. Reads the project token and host from environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`).
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` inside `<head>`, enabling automatic pageview tracking across all pages.
- **`src/lib/posthog-server.ts`** (new): Singleton pattern for the `posthog-node` server-side client. Exports `getPostHogServer()` and `shutdownPostHog()`.
- **`src/pages/index.astro`** (edited): Captures `cta_clicked` events when users click the "Start Free Trial" or "Contact Sales" hero buttons, with `cta` and `location` properties.
- **`src/pages/pricing.astro`** (edited): Captures `pricing_plan_clicked` events when users click any pricing plan CTA, with `plan` (starter/pro/enterprise) and `price` properties.
- **`src/pages/contact.astro`** (edited): Captures `contact_form_submitted` client-side on form submit (with `interest` and `has_company` properties). Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API route. Uses `posthog.captureException()` on network errors.
- **`src/pages/api/contact.ts`** (edited): Server-side tracking via `posthog-node`. Captures `contact_form_succeeded` on success, and `contact_form_failed` (with `reason`) on validation errors or server errors. Uses the session ID and distinct ID headers for session continuity.
- **`.env`** (created/updated): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a CTA button (Start Free Trial or Contact Sales) on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before server response) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form processed successfully (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form failed due to validation or server error (server-side) | `src/pages/api/contact.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **CTA Clicks Over Time** — Trend of `cta_clicked` events, broken down by `cta` property. Tracks homepage engagement.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"cta_clicked","type":"events"}],"breakdown":"cta","breakdown_type":"event","date_from":"-30d"})

2. **Pricing Plan Conversion Funnel** — Funnel from `$pageview` (pricing page) → `pricing_plan_clicked`, broken down by `plan`.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"$pageview","type":"events"},{"id":"pricing_plan_clicked","type":"events"}],"date_from":"-30d"})

3. **Contact Form Conversion Rate** — Funnel from `contact_form_submitted` → `contact_form_succeeded` to measure drop-off between client submit and server success.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"contact_form_submitted","type":"events"},{"id":"contact_form_succeeded","type":"events"}],"date_from":"-30d"})

4. **Contact Form Failure Reasons** — Breakdown of `contact_form_failed` events by `reason` property (missing_fields, invalid_email, server_error).
   - [Create this insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_form_failed","type":"events"}],"breakdown":"reason","breakdown_type":"event","date_from":"-30d"})

5. **Pricing Plan Click Breakdown** — Bar chart of `pricing_plan_clicked` by `plan` to see which plan attracts the most interest.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"pricing_plan_clicked","type":"events"}],"breakdown":"plan","breakdown_type":"event","display":"ActionsBarValue","date_from":"-30d"})

[Go to PostHog Dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
