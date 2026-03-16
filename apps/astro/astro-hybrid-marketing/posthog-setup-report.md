<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site.

## Summary of changes

- **`src/components/posthog.astro`** (new): Client-side PostHog web snippet using `is:inline` to prevent Astro TypeScript processing. Initialized with environment variables.
- **`src/lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event tracking in API routes.
- **`src/layouts/Layout.astro`** (edited): Imported and included `<PostHog />` component in `<head>` so every page initializes PostHog automatically.
- **`src/pages/index.astro`** (edited): Tracks `cta_clicked` events for the "Start Free Trial" and "Contact Sales" hero buttons.
- **`src/pages/pricing.astro`** (edited): Tracks `pricing_plan_clicked` events for each plan CTA (Starter, Pro, Enterprise) with plan name and price properties.
- **`src/pages/contact.astro`** (edited): Tracks `contact_form_submitted` on submit with interest type and company presence. Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API for session correlation. Error tracking via `captureException` on network failures.
- **`src/components/Navigation.astro`** (edited): Tracks `nav_cta_clicked` for the "Get Started" navigation button.
- **`src/pages/api/contact.ts`** (edited): Server-side tracking of `contact_form_succeeded` and `contact_form_failed` using `posthog-node`, with session ID correlation from client headers.
- **`.env`** (created): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

## Events

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a CTA button (Start Free Trial, Contact Sales) in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks to start or inquire about a pricing plan (Starter, Pro, Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (client-side, before API response) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission processed successfully (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed — validation or server error (server-side) | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | User clicks the Get Started button in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog with insights such as:

1. **CTA conversion funnel** — `cta_clicked` → `contact_form_submitted` → `contact_form_succeeded`
2. **Pricing plan interest** — breakdown of `pricing_plan_clicked` by `plan` property
3. **Contact form success rate** — `contact_form_succeeded` vs `contact_form_failed` trend over time
4. **Nav vs hero CTAs** — `nav_cta_clicked` vs `cta_clicked` to compare entry points
5. **Form failure reasons** — breakdown of `contact_form_failed` by `reason` property

Visit [PostHog](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
