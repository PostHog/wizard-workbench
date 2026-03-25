<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro hybrid rendering). Changes include:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using `is:inline` and env vars, loaded site-wide.
- **`src/lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`, with flush-on-capture config for API routes.
- **`src/layouts/Layout.astro`**: Imports and renders `<PostHog />` in `<head>` so all pages are tracked.
- **`src/pages/index.astro`**: Tracks hero CTA and Contact Sales button clicks.
- **`src/pages/pricing.astro`**: Tracks pricing plan CTA clicks (Starter, Pro, Enterprise) with plan name and price.
- **`src/pages/contact.astro`**: Tracks contact form success and network failures; passes PostHog session/distinct ID headers to server for correlation.
- **`src/pages/api/contact.ts`**: Server-side tracking via `posthog-node` for contact form received and validation failures, correlated with client session.
- **`src/components/Navigation.astro`**: Tracks Get Started nav CTA clicks.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a primary CTA button (Start Free Trial or Get Started) | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the Contact Sales button from the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA button (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form successfully | `src/pages/contact.astro` |
| `contact_form_failed` | Contact form submission failed (client-side network error) | `src/pages/contact.astro` |
| `contact_form_received` | Server received and processed a contact form submission successfully | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Contact form submission failed server-side validation | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | User clicked the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've set up the event tracking — here are some suggested insights to build in PostHog for this project:

1. **CTA Conversion Funnel** — Funnel: `cta_clicked` → `contact_form_submitted`
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImZpbHRlcnMiOnsiZXZlbnRzIjpbeyJpZCI6ImN0YV9jbGlja2VkIiwibmFtZSI6ImN0YV9jbGlja2VkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfSx7ImlkIjoiY29udGFjdF9mb3JtX3N1Ym1pdHRlZCIsIm5hbWUiOiJjb250YWN0X2Zvcm1fc3VibWl0dGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjoxfV19fQ==)

2. **Pricing Plan Popularity** — Breakdown of `pricing_plan_clicked` by `plan` property
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

3. **Contact Form Success Rate** — Trend: `contact_form_submitted` vs `contact_form_validation_failed`
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

4. **Navigation CTA Clicks** — Trend of `nav_cta_clicked` + `cta_clicked` over time
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

5. **Contact Interest Breakdown** — Breakdown of `contact_form_received` by `interest` property
   [Create in PostHog →](https://us.posthog.com/project/238460/insights/new)

[View all dashboards →](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
