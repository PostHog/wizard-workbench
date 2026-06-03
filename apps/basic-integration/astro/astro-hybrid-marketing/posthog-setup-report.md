<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into NeuralFlow AI, covering both client-side and server-side event tracking.

## Changes made

- **`src/components/posthog.astro`** (new): PostHog web snippet component that initializes the client-side SDK using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables. Uses `is:inline` and `define:vars` to avoid TypeScript processing issues.
- **`src/layouts/Layout.astro`**: Imports and renders `<PostHog />` inside `<head>`, ensuring all pages receive client-side tracking.
- **`src/lib/posthog-server.ts`** (new): Singleton wrapper around `posthog-node` for server-side event tracking in API routes.
- **`src/pages/index.astro`**: Tracks hero CTA button clicks (`Start Free Trial`, `Contact Sales`).
- **`src/pages/pricing.astro`**: Tracks plan selection (Starter, Pro) and Contact Sales click (Enterprise tier).
- **`src/pages/contact.astro`**: Tracks form submissions client-side, passes session/distinct IDs to the server, and calls `posthog.identify()` with the user's email on success.
- **`src/pages/api/contact.ts`**: Tracks `contact_form_completed` and `contact_form_failed` server-side using `posthog-node`, correlating with the client session via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- **`.env`** (new): Contains `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a hero CTA button (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked get-started/start-trial on a pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked Contact Sales from the Enterprise pricing tier | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before API response) | `src/pages/contact.astro` |
| `contact_form_completed` | Server confirmed a successful contact form submission | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed due to a server or validation error | `src/pages/api/contact.ts` |

## Next steps

The PostHog MCP API key was missing `dashboard:write`, `insight:write`, and `query:read` scopes required to auto-create a dashboard. To create an **Analytics basics** dashboard manually, visit PostHog and add insights for:

1. **Contact form conversion funnel** — Funnel: `contact_form_submitted` → `contact_form_completed`
2. **CTA clicks over time** — Trends: `cta_clicked` broken down by `cta` property
3. **Pricing plan selection** — Trends: `pricing_plan_selected` broken down by `plan`
4. **Contact form failures** — Trends: `contact_form_failed` over time
5. **Enterprise intent** — Trends: `contact_sales_clicked` over time

[Open PostHog Dashboards](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
