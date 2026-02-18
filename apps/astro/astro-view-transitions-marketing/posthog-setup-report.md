# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Astro project with View Transitions support. The integration includes:

- **PostHog component** (`src/components/posthog.astro`) - A reusable component that initializes PostHog with the web snippet, including an initialization guard (`window.__posthog_initialized`) to prevent stack overflow errors during soft navigation with View Transitions.
- **Automatic pageview tracking** - Configured with `capture_pageview: 'history_change'` for automatic pageview capture during soft navigation.
- **Environment variables** - PostHog API key and host are stored securely in `.env` using the `PUBLIC_` prefix for client-side access.
- **Event tracking** - Custom events for tracking user interactions across the site.

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicked the Start Free Trial button on the homepage hero section | `src/pages/index.astro` |
| `cta_clicked` | User clicked the Read the Docs button on the homepage hero section | `src/pages/index.astro` |
| `pricing_cta_clicked` | User clicked Get Started on the Starter pricing plan | `src/pages/pricing.astro` |
| `pricing_cta_clicked` | User clicked Start Free Trial on the Pro pricing plan | `src/pages/pricing.astro` |
| `pricing_cta_clicked` | User clicked Contact Sales on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked on a documentation section card | `src/pages/docs.astro` |

## Event Properties

### `cta_clicked`
- `cta_type`: Type of CTA (`start_free_trial` or `read_docs`)
- `location`: Where the CTA is located (`hero`)

### `pricing_cta_clicked`
- `plan`: Pricing plan name (`starter`, `pro`, or `enterprise`)
- `price`: Plan price (`$29/month`, `$99/month`, or `custom`)

### `nav_cta_clicked`
- `location`: Always `navigation`

### `docs_section_clicked`
- `section`: Documentation section identifier (`getting-started`, `api-reference`, `integrations`, `workflows`, `security`, `faq`)

## Next steps

Once you start using your application, events will begin flowing into PostHog. You can then create insights and dashboards to visualize:

1. **CTA Conversion Funnel** - Track users from homepage visit to clicking "Start Free Trial"
2. **Pricing Page Analysis** - See which pricing tiers are most clicked
3. **Documentation Engagement** - Understand which docs sections users explore most
4. **Navigation CTA Performance** - Measure effectiveness of the persistent "Get Started" button

Visit your PostHog dashboard to create these insights: https://us.i.posthog.com

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
