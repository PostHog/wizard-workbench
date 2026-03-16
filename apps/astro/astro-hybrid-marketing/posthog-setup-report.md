<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. The integration covers both client-side and server-side event tracking with proper session correlation.

## Summary of changes

- **`src/env.d.ts`** (new) — Added Astro client type reference (`/// <reference types="astro/client" />`) to enable `import.meta.env` TypeScript support.
- **`src/components/posthog.astro`** (new) — PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables at build time. Loads posthog-js for client-side analytics.
- **`src/layouts/Layout.astro`** — Imported and rendered `<PostHog />` inside `<head>` so all pages get PostHog initialized automatically.
- **`src/lib/posthog-server.ts`** (new) — Singleton `getPostHogServer()` function using `posthog-node` for server-side event tracking. Uses `flushAt: 1` / `flushInterval: 0` to flush events immediately on API routes.
- **`src/pages/api/contact.ts`** — Added server-side capture of `contact_form_submitted` and `contact_form_failed` events. Reads `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers passed from the client to correlate sessions. Also calls `posthog.identify()` on successful form submission.
- **`src/pages/contact.astro`** — Updated fetch call to pass `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers from `window.posthog` to the API route. Calls `posthog.captureException()` on network errors.
- **`src/pages/index.astro`** — Added `is:inline` script to capture `cta_clicked` (Start Free Trial) and `contact_sales_clicked` (Contact Sales) button clicks.
- **`src/pages/pricing.astro`** — Added `data-plan` / `data-price` attributes to plan CTA buttons and an `is:inline` script to capture `pricing_plan_clicked` with plan name and price.
- **`src/components/Navigation.astro`** — Added `is:inline` script to capture `get_started_clicked` on the nav CTA.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values.
- **`package.json`** — Added `posthog-node ^5.28.2` dependency.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the 'Start Free Trial' CTA on the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) — includes `plan` and `price` properties | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form submitted successfully (server-side) — includes `interest`, `has_company`, session ID | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed validation (server-side) — includes `reason`, session ID | `src/pages/api/contact.ts` |

## Next steps

To build a dashboard in PostHog for these events, navigate to [PostHog Project 2](https://us.posthog.com/project/2) and create an **"Analytics basics"** dashboard with these recommended insights:

1. **CTA conversion funnel** — Funnel: `cta_clicked` → `contact_form_submitted` (tracks users from hero CTA to form submission)
2. **Pricing plan interest** — Trends: `pricing_plan_clicked` broken down by `plan` property (shows which plan attracts the most clicks)
3. **Contact form success rate** — Trends: `contact_form_submitted` vs `contact_form_failed` (monitors form UX quality)
4. **Top-of-funnel CTAs** — Trends: `cta_clicked`, `contact_sales_clicked`, `get_started_clicked` over time (overall engagement)
5. **Contact intent breakdown** — `contact_form_submitted` broken down by `interest` property (demo, pricing, enterprise, etc.)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
