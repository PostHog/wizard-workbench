# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet using `is:inline` to prevent Astro from processing it. Initialised with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/layouts/Layout.astro`**: Imported and rendered `<PostHog />` inside `<head>` so every page loads analytics automatically.
- **`src/lib/posthog-server.ts`** (new): Singleton factory `getPostHogServer()` for the `posthog-node` client, used by API routes to avoid creating multiple connections.
- **`src/pages/index.astro`**: Tracks hero CTA clicks (`cta_clicked`) and "Contact Sales" clicks (`contact_sales_clicked`).
- **`src/pages/pricing.astro`**: Tracks which pricing plan CTA a visitor clicks (`pricing_plan_selected`, with `plan` and `price` properties).
- **`src/pages/contact.astro`**: On successful form submission, calls `posthog.identify()` with the visitor's email, name, and company, then captures `contact_form_submitted`. Network errors are captured via `posthog.captureException()`. The PostHog session ID and distinct ID are forwarded to the API via headers so client and server events share a session.
- **`src/pages/api/contact.ts`**: Server-side events using `posthog-node`. Captures `contact_form_completed` (success) with an `identify()` call, and `contact_form_failed` (validation or server error) with a `reason` property. Uses the forwarded `X-PostHog-Distinct-Id` and `X-PostHog-Session-Id` headers for session continuity.
- **`src/env.d.ts`** (new): TypeScript global `Window` interface augmentation for `window.posthog`, enabling type-safe access in processed `<script>` blocks.
- **`.env`** (new): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set to the project's values.

## Events

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" hero button | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a plan CTA on the pricing page (Starter / Pro / Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form successfully submitted (client-side, after 200 response) | `src/pages/contact.astro` |
| `contact_form_completed` | Contact form received and processed successfully (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form failed validation or hit a server error (server-side) | `src/pages/api/contact.ts` |

## Next steps

We've set up the following suggested insights for an **Analytics basics** dashboard. To create it, visit [Dashboards](/dashboard) in your PostHog project and add these insights:

1. **CTA conversion trend** — Trends chart for `cta_clicked` and `contact_sales_clicked` over time. Shows which hero CTA drives more engagement.
2. **Pricing plan selection breakdown** — Trends chart for `pricing_plan_selected` broken down by the `plan` property (Starter / Pro / Enterprise). Shows which plan attracts the most interest.
3. **Contact form funnel** — Funnel: `pricing_plan_selected` → `contact_form_submitted` → `contact_form_completed`. Measures the full conversion from pricing interest to a completed lead.
4. **Contact form failure rate** — Trends chart comparing `contact_form_completed` vs `contact_form_failed` over time. Helps spot validation or server issues.
5. **Lead interest breakdown** — Trends chart for `contact_form_completed` broken down by the `interest` property. Shows which offering (demo, pricing, enterprise, etc.) is most requested.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
