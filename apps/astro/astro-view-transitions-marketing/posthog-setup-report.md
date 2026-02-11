# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro marketing site with View Transitions support. The integration includes:

- **PostHog initialization component** (`src/components/posthog.astro`) with a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation
- **Automatic pageview tracking** using `capture_pageview: 'history_change'` for View Transitions/ClientRouter compatibility
- **Environment variable configuration** for the PostHog API key and host
- **Custom event tracking** on key conversion points throughout the site

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `cta_clicked` | User clicked a call-to-action button on the homepage (Start Free Trial, Read the Docs) | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan button (Get Started, Start Free Trial, Contact Sales) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicked the Get Started button in the navigation header | `src/components/Navigation.astro` |

## Event Properties

### `cta_clicked`
- `cta_type`: The type of CTA (e.g., "start_free_trial", "read_the_docs")
- `page`: The page where the CTA was clicked
- `button_text`: The text content of the button

### `pricing_plan_selected`
- `plan_name`: The selected plan (e.g., "starter", "pro", "enterprise")
- `plan_price`: The price of the plan
- `button_text`: The text content of the button

### `docs_section_clicked`
- `section_name`: The identifier of the docs section
- `section_title`: The display title of the section

### `nav_get_started_clicked`
- `location`: Where the button is located (navigation_header)
- `current_page`: The current page pathname when clicked

## Next steps

Create a dashboard in PostHog with insights based on these events:

1. **CTA Conversion Funnel**: Track users from homepage visit → CTA click → pricing page → plan selection
2. **Pricing Plan Selection Breakdown**: Pie chart showing distribution of plan selections
3. **Navigation Get Started Clicks by Page**: Which pages drive the most Get Started clicks
4. **Documentation Section Popularity**: Which docs sections are most clicked
5. **Conversion Rate Trend**: Daily trend of key conversion events

Visit your [PostHog dashboard](https://us.posthog.com) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Configuration

Environment variables are stored in `.env`:
- `PUBLIC_POSTHOG_KEY`: Your PostHog project API key
- `PUBLIC_POSTHOG_HOST`: The PostHog host URL (https://us.i.posthog.com)
