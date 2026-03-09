<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Astro hybrid-rendering marketing site. Here's a summary of what was done:

**New files created:**
- `src/components/posthog.astro` — Client-side PostHog snippet using `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables.
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side tracking. Exposes `getPostHogServer()` and `shutdownPostHog()`.
- `.env` — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` set correctly.

**Files modified:**
- `src/layouts/Layout.astro` — Imports and renders `<PostHog />` in `<head>` so every page gets client-side analytics.
- `src/pages/index.astro` — Added CTA click tracking on "Start Free Trial" and "Contact Sales" hero buttons.
- `src/pages/pricing.astro` — Added pricing plan click tracking (Starter, Pro) and Contact Sales click tracking (Enterprise) with `plan` and `price_usd` properties.
- `src/pages/contact.astro` — Added form submission, success, and error events. Passes PostHog session ID and distinct ID to the API via request headers. Includes `captureException` for network errors.
- `src/pages/api/contact.ts` — Added `posthog-node` server-side `contact_form_received` event. Uses the session ID and distinct ID from request headers to correlate with client events.

**Packages installed:** `posthog-js`, `posthog-node`

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked a hero CTA button (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan button (Starter or Pro), with `plan` and `price_usd` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing card | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (fires before the API response) | `src/pages/contact.astro` |
| `contact_form_success` | Contact form was successfully acknowledged by the server | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission failed (validation, server, or network error) | `src/pages/contact.astro` |
| `contact_form_received` | Server confirmed receipt of valid contact form data (server-side, correlated via session ID) | `src/pages/api/contact.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these 5 insights:

1. **CTA Conversion Trend** — Trend of `cta_clicked` and `contact_sales_clicked` over time, broken down by `cta_text`.
2. **Pricing Plan Interest** — Breakdown of `pricing_plan_clicked` by `plan` to see which tier attracts most interest.
3. **Contact Form Funnel** — Funnel from `contact_form_submitted` → `contact_form_success` to measure conversion rate.
4. **Contact Form Errors** — Count of `contact_form_error` events, broken down by `error` property to identify failure patterns.
5. **Client-to-Server Correlation** — Trend comparing `contact_form_submitted` (client) vs `contact_form_received` (server) to verify session continuity.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
