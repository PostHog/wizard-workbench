<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI Astro hybrid marketing site. The integration covers both client-side browser analytics via the PostHog JavaScript snippet and server-side event tracking via `posthog-node` in the API route, following the hybrid rendering pattern where most pages are statically pre-rendered and only the contact API route opts into SSR.

**Packages installed:** `posthog-js`, `posthog-node`

**New files created:**
- `src/components/posthog.astro` — Client-side PostHog snippet component using `is:inline` and env vars
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side tracking

**Files modified:**
- `src/layouts/Layout.astro` — Imported and rendered `<PostHog />` in `<head>` for site-wide analytics
- `src/pages/index.astro` — Added CTA click tracking on hero buttons
- `src/pages/pricing.astro` — Added pricing page view and plan click tracking
- `src/pages/features.astro` — Added features page view tracking
- `src/components/Navigation.astro` — Added Get Started nav click tracking
- `src/pages/contact.astro` — Added form submission/error tracking with session ID correlation headers
- `src/pages/api/contact.ts` — Added server-side form receipt and validation failure tracking via `posthog-node`

**Environment variables set** (in `.env`):
- `PUBLIC_POSTHOG_KEY` — PostHog project API key (client-side ingestion)
- `PUBLIC_POSTHOG_HOST` — PostHog host URL

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' CTA button on the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' button on the hero section | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page — top of pricing conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) on the pricing page | `src/pages/pricing.astro` |
| `features_page_viewed` | User views the features page — indicates product interest | `src/pages/features.astro` |
| `get_started_clicked` | User clicks the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | User submits the contact form — client-side success confirmation | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission encountered a client-side network or validation error | `src/pages/contact.astro` |
| `contact_form_received` | Server-side: Contact form submission successfully processed by the API route | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server-side: Contact form submission failed server-side validation | `src/pages/api/contact.ts` |

## Next steps

We've designed the following insights and dashboard for you to keep an eye on user behavior. Please create them in your PostHog project at https://us.posthog.com/project/2:

**Dashboard: "Analytics basics"**

1. **Trial & Sales CTA Conversion** (Trend) — Track `cta_clicked` and `contact_sales_clicked` over time to monitor top-of-funnel CTA performance.

2. **Pricing Page to Plan Click Funnel** (Funnel) — Steps: `pricing_page_viewed` → `pricing_plan_clicked`. Shows how many visitors who view pricing click through to a plan.

3. **Contact Form Conversion Funnel** (Funnel) — Steps: `contact_form_submitted` → `contact_form_received`. Correlates client-side form submissions with confirmed server-side receipt.

4. **Contact Form Error Rate** (Trend) — Track `contact_form_error` and `contact_form_validation_failed` over time to identify and reduce form friction.

5. **Feature Engagement Overview** (Trend) — Track `get_started_clicked`, `features_page_viewed`, and `pricing_page_viewed` together to monitor overall engagement across key conversion pages.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
