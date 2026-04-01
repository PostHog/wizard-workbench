<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI static Astro marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): Reusable PostHog initialization component using the web snippet with `is:inline` to prevent Astro TypeScript processing. Reads token and host from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** (updated): Imports and mounts `<PostHog />` inside `<head>`, ensuring PostHog is active on every page.
- **`src/pages/index.astro`** (updated): Tracks clicks on the hero "Start Free Trial" and "Read the Docs" CTAs with `cta_clicked`.
- **`src/pages/pricing.astro`** (updated): Tracks clicks on all three pricing plan CTAs (Starter, Pro, Enterprise) with `pricing_plan_selected` and plan/CTA metadata.
- **`src/components/Navigation.astro`** (updated): Tracks clicks on the nav "Get Started" CTA with `nav_cta_clicked`.
- **`src/pages/docs.astro`** (updated): Tracks clicks on all six documentation section cards with `docs_section_clicked` and section name metadata.
- **`.env`** (new): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set from project config.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" or "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on a pricing plan card (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the top navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |

## Next steps

The available API credentials don't have dashboard write access, so the "Analytics basics" dashboard could not be created automatically. You can build it manually in PostHog using the events above. Here are pre-configured insight links to get you started quickly:

- **CTA clicks over time** — trend of all `cta_clicked` events, broken down by `cta_text`:
  https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"cta_clicked","name":"cta_clicked","type":"events","order":0}],"breakdown":"cta_text","breakdown_type":"event"}

- **Pricing plan conversion funnel** — funnel from `$pageview` on `/pricing` → `pricing_plan_selected`:
  https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"$pageview","name":"$pageview","type":"events","order":0,"properties":[{"key":"$pathname","value":"/pricing","operator":"exact","type":"event"}]},{"id":"pricing_plan_selected","name":"pricing_plan_selected","type":"events","order":1}]}

- **Pricing plan breakdown** — count of `pricing_plan_selected` broken down by `plan_name`:
  https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"pricing_plan_selected","name":"pricing_plan_selected","type":"events","order":0}],"breakdown":"plan_name","breakdown_type":"event"}

- **Docs section popularity** — count of `docs_section_clicked` broken down by `section_name`:
  https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"docs_section_clicked","name":"docs_section_clicked","type":"events","order":0}],"breakdown":"section_name","breakdown_type":"event"}

- **Nav to trial conversion funnel** — funnel from `nav_cta_clicked` → `pricing_plan_selected`:
  https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"nav_cta_clicked","name":"nav_cta_clicked","type":"events","order":0},{"id":"pricing_plan_selected","name":"pricing_plan_selected","type":"events","order":1}]}

To create the "Analytics basics" dashboard, go to [Dashboards](https://us.posthog.com/project/238460/dashboards) → New dashboard, then add each insight above.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
