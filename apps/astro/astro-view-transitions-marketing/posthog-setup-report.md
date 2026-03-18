<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions). Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog web snippet wrapped in a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation with Astro's `<ViewTransitions />` (ClientRouter). Uses `capture_pageview: 'history_change'` for automatic pageview tracking on each navigation. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** (edited): Imported and added `<PostHog />` to the `<head>`, so PostHog is initialized on every page.
- **`src/pages/index.astro`** (edited): Added inline script to capture `hero_cta_clicked` (Start Free Trial) and `hero_docs_clicked` (Read the Docs) events. Uses both `DOMContentLoaded` and `astro:page-load` listeners for view transition compatibility.
- **`src/pages/pricing.astro`** (edited): Added CSS classes to pricing CTAs and an inline script to capture `pricing_starter_clicked`, `pricing_pro_trial_clicked`, and `pricing_enterprise_contact_clicked` events with plan name and price properties.
- **`src/pages/docs.astro`** (edited): Added inline script to capture `docs_section_clicked` events on each documentation card, including the section name as a property.
- **`src/components/Navigation.astro`** (edited): Added inline script to capture `nav_get_started_clicked` event when the top-nav CTA is clicked.
- **`.env`** (created): Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `hero_cta_clicked` | User clicks 'Start Free Trial' in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks 'Read the Docs' in the hero section | `src/pages/index.astro` |
| `pricing_starter_clicked` | User clicks 'Get Started' on the Starter plan | `src/pages/pricing.astro` |
| `pricing_pro_trial_clicked` | User clicks 'Start Free Trial' on the Pro plan | `src/pages/pricing.astro` |
| `pricing_enterprise_contact_clicked` | User clicks 'Contact Sales' on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks 'Get Started' in the top navigation | `src/components/Navigation.astro` |

## Next steps

We've prepared an "Analytics basics" dashboard for you based on the events instrumented above. You can create it in PostHog using the links below:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new) — suggested insights to add:
  1. **Pricing CTA conversion funnel** — Funnel from any page → pricing page → pricing plan clicked (`pricing_starter_clicked` OR `pricing_pro_trial_clicked` OR `pricing_enterprise_contact_clicked`)
  2. **Hero CTA clicks trend** — Trend of `hero_cta_clicked` over time to track homepage conversion interest
  3. **Pricing plan breakdown** — Bar chart comparing `pricing_starter_clicked`, `pricing_pro_trial_clicked`, and `pricing_enterprise_contact_clicked` to see which plan attracts the most interest
  4. **Docs engagement** — Trend of `docs_section_clicked` broken down by `section` property to see which docs sections are most popular
  5. **Nav vs. hero CTA comparison** — Trend comparing `nav_get_started_clicked` and `hero_cta_clicked` to understand where users engage with conversion CTAs

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
