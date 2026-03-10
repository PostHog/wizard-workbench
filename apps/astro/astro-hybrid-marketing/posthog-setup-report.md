<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. Here's a summary of all changes:

## Changes Made

### New Files Created
- **`src/components/posthog.astro`** — Client-side PostHog initialization component using the web snippet with `is:inline` to prevent Astro TypeScript processing. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/lib/posthog-server.ts`** — Server-side PostHog singleton client using `posthog-node`. Exposes `getPostHogServer()` (lazily initialized) and `shutdownPostHog()` for graceful teardown.
- **`.env`** — Environment file with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` values (covered by `.gitignore`).

### Modified Files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in the `<head>`, enabling analytics on every page.
- **`src/pages/index.astro`** — Added IDs to hero CTA buttons and `is:inline` script to fire `cta_clicked` events with `cta_text`, `cta_location`, and `page` properties.
- **`src/pages/pricing.astro`** — Added `data-plan` and `data-cta` attributes to pricing buttons and a script to fire `pricing_plan_clicked` events with `plan` and `cta_text` properties.
- **`src/pages/contact.astro`** — Updated the form submit handler to fire `contact_form_submitted` (with `interest` and `has_company` properties), pass `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API route, and call `posthog.captureException()` on network errors.
- **`src/pages/api/contact.ts`** — Added server-side tracking via `posthog-node`: fires `contact_form_failed` (with `reason` property) on validation errors, and `contact_form_succeeded` (with `interest` and `has_company`) on success. Reads session/distinct ID from request headers for session continuity.

### Packages Installed
- `posthog-js` — Client-side analytics
- `posthog-node` — Server-side event tracking in API routes

## Events Instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a CTA button (Start Free Trial or Contact Sales) on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Get Started, Start Free Trial, or Contact Sales) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before API call) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission was successfully processed by the server | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed (validation error or server error) | `src/pages/api/contact.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **CTA Click Rate** — Trend of `cta_clicked` events, broken down by `cta_text` (Start Free Trial vs Contact Sales)
2. **Pricing Plan Interest** — Trend of `pricing_plan_clicked` events, broken down by `plan` (starter / pro / enterprise)
3. **Contact Form Conversion Funnel** — Funnel: `contact_form_submitted` → `contact_form_succeeded`
4. **Contact Form Failure Rate** — Trend of `contact_form_failed` events, broken down by `reason`
5. **Contact Interest Breakdown** — `contact_form_succeeded` events broken down by `interest` property (demo / pricing / enterprise / partnership)

To create the dashboard, visit your [PostHog project](https://us.posthog.com/project/2/dashboards) and click **New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
