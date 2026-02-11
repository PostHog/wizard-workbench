# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Astro static marketing site. The integration includes the PostHog web snippet for automatic pageview tracking, session replay, and custom event capture for key conversion actions across the site.

## Integration summary

- **PostHog Component**: Created `src/components/posthog.astro` with the PostHog web snippet using `is:inline` directive to prevent TypeScript errors
- **Layout Integration**: Added PostHog component to `src/layouts/Layout.astro` to ensure analytics loads on all pages
- **Environment Variables**: Configured `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` in `.env` file
- **Event Tracking**: Added custom event capture for key conversion actions

## Events implemented

| Event Name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicks 'Start Free Trial' CTA button on homepage hero section | `src/pages/index.astro` |
| `cta_clicked` | User clicks 'Read the Docs' CTA button on homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks 'Get Started' on Starter pricing plan | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks 'Start Free Trial' on Pro pricing plan | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks 'Contact Sales' on Enterprise pricing plan | `src/pages/pricing.astro` |
| `doc_topic_clicked` | User clicks a documentation topic card on the docs page | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks 'Get Started' CTA in the main navigation | `src/components/Navigation.astro` |

## Event properties

### `cta_clicked`
- `cta_text`: The text displayed on the CTA button
- `cta_location`: Where the CTA is located (e.g., 'hero')
- `page`: The page where the CTA was clicked

### `pricing_plan_clicked`
- `plan`: The pricing plan selected (starter, pro, enterprise)
- `price`: The price of the plan
- `cta_text`: The text displayed on the button

### `doc_topic_clicked`
- `topic`: The topic identifier (e.g., 'getting-started', 'api-reference')
- `title`: The displayed title of the documentation topic

### `nav_cta_clicked`
- `cta_text`: The text displayed on the CTA
- `cta_location`: 'navigation'

## Next steps

We've instrumented your site with PostHog analytics. To create insights and dashboards based on these events:

1. **Log into PostHog**: Visit https://us.i.posthog.com and sign in to your project
2. **Create insights** for:
   - **CTA Conversion Funnel**: Track users from pageview -> cta_clicked -> pricing_plan_clicked
   - **Pricing Plan Popularity**: Compare which pricing plans get the most clicks
   - **Documentation Engagement**: See which docs topics are most popular
   - **Navigation CTA Performance**: Track nav CTA click rates
3. **Build a dashboard**: Create an "Analytics Basics" dashboard with these insights

### Suggested insights to create

1. **Homepage CTA Click Rate** - Trend of `cta_clicked` events where `page = 'home'`
2. **Pricing Plan Distribution** - Breakdown of `pricing_plan_clicked` by `plan` property
3. **Docs Topic Engagement** - Breakdown of `doc_topic_clicked` by `topic` property
4. **Marketing Funnel** - Funnel from `$pageview` -> `cta_clicked` -> `pricing_plan_clicked`
5. **Navigation CTA Performance** - Trend of `nav_cta_clicked` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
