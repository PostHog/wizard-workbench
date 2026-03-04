<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. The following changes were made:

- **Installed** `posthog-node` package for server-side event tracking.
- **Created** `src/components/posthog.astro` — client-side PostHog snippet using `is:inline` directive with environment variable injection via `define:vars`.
- **Updated** `src/layouts/Layout.astro` — added PostHog component to `<head>`, ensuring analytics loads on every page.
- **Created** `src/lib/posthog-server.ts` — singleton `getPostHogServer()` function for server-side PostHog client to avoid creating multiple instances.
- **Updated** `src/pages/index.astro` — tracks `cta_clicked` events for "Start Free Trial" and "Contact Sales" hero CTA buttons.
- **Updated** `src/components/Navigation.astro` — tracks `get_started_clicked` when the nav bar CTA is clicked.
- **Updated** `src/pages/pricing.astro` — tracks `pricing_plan_clicked` with plan name and price for all three pricing tier CTAs.
- **Updated** `src/pages/contact.astro` — tracks `contact_form_submitted` on form submit (client-side) and passes the PostHog session ID to the API route via `X-PostHog-Session-Id` header.
- **Updated** `src/pages/api/contact.ts` — server-side tracking: captures `contact_form_completed` on success (with interest type and company), `contact_form_failed` on validation errors (with failure reason), and `captureException` on server errors. Session ID is read from the request header to maintain session correlation.
- **Configured** environment variables: `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` written to `.env`.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked 'Start Free Trial' or 'Contact Sales' CTA on the homepage hero | `src/pages/index.astro` |
| `get_started_clicked` | User clicked the 'Get Started' button in the top navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before API response) | `src/pages/contact.astro` |
| `contact_form_completed` | Contact form processed successfully on the server | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed due to validation error | `src/pages/api/contact.ts` |

## Next steps

We were unable to programmatically create the PostHog dashboard and insights due to the current API key lacking `dashboard:write` and `insight:write` scopes. To set up your "Analytics basics" dashboard manually, visit your PostHog project and create a dashboard with the following suggested insights:

1. **Contact Form Conversion Funnel** — Funnel from `contact_form_submitted` → `contact_form_completed`. Shows drop-off between form submit and server success.
2. **CTA Clicks Trend** — Trend of `cta_clicked` broken down by `cta` property (`start_free_trial` vs `contact_sales`). Tracks which hero CTAs drive the most engagement.
3. **Pricing Plan Interest** — Trend or breakdown of `pricing_plan_clicked` by `plan` property. Shows which pricing tier gets the most clicks.
4. **Get Started Navigation Clicks** — Trend of `get_started_clicked`. Tracks nav CTA engagement.
5. **Contact Form Failure Rate** — Trend of `contact_form_failed` broken down by `reason` property. Monitors validation errors and form UX issues.

Visit [PostHog project 2](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
