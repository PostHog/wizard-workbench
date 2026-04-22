<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. The integration covers both client-side (browser) and server-side (API routes) event tracking, using the PostHog JavaScript snippet for the frontend and `posthog-node` for backend events. A singleton pattern ensures the server-side client is created only once. Session and distinct IDs are forwarded from the browser to the API route via request headers to maintain unified session tracking.

## Changes made

| File | Change |
|------|--------|
| `src/components/posthog.astro` | **Created** — PostHog client-side snippet component using `is:inline` and `define:vars` to inject env vars |
| `src/layouts/Layout.astro` | **Updated** — Imports and renders `<PostHog />` in `<head>` so all pages are tracked |
| `src/lib/posthog-server.ts` | **Created** — Singleton `getPostHogServer()` for server-side `posthog-node` client |
| `src/pages/api/contact.ts` | **Updated** — Captures `contact_form_submitted` and `contact_form_failed` events server-side, with session/distinct ID correlation |
| `src/pages/contact.astro` | **Updated** — Captures `contact_form_submit_clicked` client-side; forwards PostHog session & distinct IDs to the API; captures exceptions on network errors |
| `src/pages/index.astro` | **Updated** — Captures `start_free_trial_clicked` and `contact_sales_clicked` on hero CTA buttons |
| `src/pages/pricing.astro` | **Updated** — Captures `pricing_plan_selected` with `plan` property (starter/pro/enterprise) on all pricing CTA buttons |
| `src/components/Navigation.astro` | **Updated** — Captures `nav_get_started_clicked` on the nav CTA |
| `.env` | **Updated** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set via env vars |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `start_free_trial_clicked` | User clicks the "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (includes `plan`: starter/pro/enterprise) | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" button in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submit_clicked` | User clicks submit on the contact form (client-side, includes `interest`) | `src/pages/contact.astro` |
| `contact_form_submitted` | Contact form successfully processed by the server (includes name, email, company, interest) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed validation or server error (includes `reason`) | `src/pages/api/contact.ts` |

## Next steps

To monitor user behavior across the NeuralFlow marketing funnel, we recommend creating the following insights in your PostHog project:

1. **CTA conversion funnel** — Funnel from `start_free_trial_clicked` or `pricing_plan_selected` → `contact_form_submit_clicked` → `contact_form_submitted`
2. **Pricing plan popularity** — Trend of `pricing_plan_selected` broken down by `plan` property
3. **Contact form success rate** — Trend of `contact_form_submitted` vs `contact_form_failed`
4. **Navigation CTA engagement** — Trend of `nav_get_started_clicked` over time
5. **Top-of-funnel interest** — `contact_form_submitted` broken down by `interest` property

Log in to your PostHog project at https://us.i.posthog.com to build these insights and a dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
