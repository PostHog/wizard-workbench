<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro hybrid rendering). The integration includes:

- **Client-side analytics** via the PostHog JavaScript snippet (`posthog-js`) embedded in the shared `Layout.astro` through a new `src/components/posthog.astro` component
- **Server-side analytics** via `posthog-node` with a singleton client (`src/lib/posthog-server.ts`) tracking critical API route events
- **Session continuity** between client and server by passing `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers from the browser to the contact form API route
- **Error tracking** via `posthog.captureException()` on client-side fetch failures and `posthog.capture()` for server-side errors
- **Conversion funnel tracking** from Features page view → pricing plan selection → contact form submission

### Files created

| File | Purpose |
|------|---------|
| `src/components/posthog.astro` | Client-side PostHog snippet with `is:inline` directive |
| `src/lib/posthog-server.ts` | Singleton `posthog-node` client for server-side tracking |
| `.env` | Environment variables `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` |

### Files modified

| File | Changes |
|------|---------|
| `src/layouts/Layout.astro` | Added `<PostHog />` component import and usage in `<head>` |
| `src/pages/index.astro` | Added CTA click tracking for hero buttons |
| `src/pages/pricing.astro` | Added pricing plan selection and Contact Sales click tracking |
| `src/pages/contact.astro` | Added form submit tracking + session/distinct ID headers + error capture |
| `src/pages/api/contact.ts` | Added server-side event tracking with `posthog-node` |
| `src/pages/features.astro` | Added features page view tracking (funnel top) |
| `src/components/Navigation.astro` | Added Get Started nav CTA click tracking |

## Events instrumented

| Event Name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicked a call-to-action button (Start Free Trial, Contact Sales, Get Started) | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA (Starter, Pro, Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked Contact Sales from pricing page to reach out about Enterprise plan | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form with their details and interest (client-side) | `src/pages/contact.astro` |
| `contact_form_submission_received` | Server received and processed a contact form submission successfully | `src/pages/api/contact.ts` |
| `contact_form_error` | Contact form submission encountered a server-side error | `src/pages/api/contact.ts` |
| `features_section_viewed` | User navigated to and viewed the Features page (top of conversion funnel) | `src/pages/features.astro` |
| `navigation_cta_clicked` | User clicked the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've identified the key events to build these insights in your PostHog dashboard:

### Suggested insights to build

Navigate to [your PostHog project](https://us.posthog.com/project/238460) and create an **"Analytics basics"** dashboard with these insights:

1. **Conversion Funnel** — Funnel: `features_section_viewed` → `pricing_plan_selected` → `contact_form_submitted`
2. **CTA Clicks Over Time** — Trends: `cta_clicked` + `navigation_cta_clicked` events over time
3. **Pricing Plan Breakdown** — Trends with breakdown by `plan` property on `pricing_plan_selected` event
4. **Contact Form Success Rate** — Trends: `contact_form_submitted` vs `contact_form_submission_received` (to see client vs server confirmation rates)
5. **Contact Form Errors** — Trends: `contact_form_error` events over time for monitoring server errors

### Direct links

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Create New Insight](https://us.posthog.com/project/238460/insights/new)
- [PostHog Astro Integration Docs](https://posthog.com/docs/libraries/astro)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
