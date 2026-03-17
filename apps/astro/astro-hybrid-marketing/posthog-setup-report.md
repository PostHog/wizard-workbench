<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using `is:inline` to prevent Astro from processing it. Initialized from environment variables.
- **`src/lib/posthog-server.ts`** (new): Singleton pattern for the `posthog-node` server-side client used in API routes.
- **`src/layouts/Layout.astro`** (edited): Imports and includes the `<PostHog />` component in `<head>` so all pages get client-side analytics.
- **`src/components/Navigation.astro`** (edited): Tracks clicks on the "Get Started" nav CTA.
- **`src/pages/index.astro`** (edited): Tracks clicks on "Start Free Trial" and "Contact Sales" hero CTA buttons.
- **`src/pages/pricing.astro`** (edited): Tracks clicks on all pricing plan CTAs with the plan name as a property.
- **`src/pages/contact.astro`** (edited): Tracks contact form success and errors; passes PostHog session and distinct IDs to the API via headers for session continuity.
- **`src/pages/api/contact.ts`** (edited): Server-side tracking of contact form receipt and failures using `posthog-node`, correlating with the client session via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `nav_get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `cta_clicked` | User clicks "Start Free Trial" hero CTA (with `cta` and `location` properties) | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" hero CTA | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (with `plan`: starter/pro/enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form successfully submitted (with `interest` and `has_company`) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission failed on the client side | `src/pages/contact.astro` |
| `contact_form_received` | Server confirmed receipt of a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_failed` | Server encountered an error processing a contact form | `src/pages/api/contact.ts` |

## Next steps

To view your analytics data and build dashboards, visit your PostHog project:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

Suggested insights to build in PostHog:

1. **Contact form conversion funnel** — Funnel from `pricing_plan_clicked` → `contact_sales_clicked` → `contact_form_submitted`
2. **CTA click trends** — Trend of `cta_clicked` and `contact_sales_clicked` over time
3. **Pricing plan interest breakdown** — `pricing_plan_clicked` broken down by `plan` property
4. **Contact form success rate** — Ratio of `contact_form_received` to `contact_form_failed`
5. **Nav engagement** — Trend of `nav_get_started_clicked` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
