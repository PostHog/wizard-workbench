<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro hybrid marketing site.

## Summary of changes

- **`src/components/posthog.astro`** *(new)* — Client-side PostHog initialization snippet using the `is:inline` directive with `define:vars` to inject environment variables safely.
- **`src/layouts/Layout.astro`** — Imports and renders the `<PostHog />` component in the `<head>`, ensuring PostHog loads on every page.
- **`src/lib/posthog-server.ts`** *(new)* — Singleton server-side PostHog client using `posthog-node`. Exposes `getPostHogServer()` and `shutdownPostHog()`.
- **`src/pages/index.astro`** — Tracks `cta_clicked` (Start Free Trial) and `contact_sales_clicked` (Contact Sales) on hero CTA buttons.
- **`src/pages/pricing.astro`** — Tracks `pricing_plan_cta_clicked` with a `plan` property (`starter`, `pro`, `enterprise`) on each pricing card CTA.
- **`src/pages/contact.astro`** — Tracks `contact_form_submitted` (on submit), `contact_form_succeeded` (on success), and `contact_form_failed` (on error/network failure). Passes `X-PostHog-Session-Id` header to the API for session continuity. Error exceptions are captured with `captureException`.
- **`src/pages/api/contact.ts`** — Server-side tracking of `contact_form_received` using `posthog-node`, with `$session_id` from request headers for unified session tracking.
- **`src/components/Navigation.astro`** — Tracks `get_started_clicked` on the nav CTA.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables set.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" hero CTA | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicks a pricing plan CTA (starter/pro/enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission succeeded | `src/pages/contact.astro` |
| `contact_form_failed` | Contact form submission failed (API error or network) | `src/pages/contact.astro` |
| `contact_form_received` | Server received and processed a contact form submission | `src/pages/api/contact.ts` |
| `get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog and add these recommended insights:

1. **Contact Form Conversion Funnel** — Funnel from `contact_form_submitted` → `contact_form_succeeded`
2. **Hero CTA Clicks Over Time** — Trend of `cta_clicked` + `contact_sales_clicked`
3. **Pricing Plan Interest** — Breakdown of `pricing_plan_cta_clicked` by `plan` property
4. **Contact Form Failures** — Trend of `contact_form_failed` to monitor submission errors
5. **Get Started Clicks** — Trend of `get_started_clicked` from navigation

Create and manage your insights here:
- PostHog project: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
