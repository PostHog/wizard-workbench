<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **NeuralFlow AI** static Astro (SSG) marketing site. Here's what was done:

- Installed `posthog-js` as a dependency
- Created `src/components/posthog.astro` — a reusable PostHog snippet component using the `is:inline` directive (required to prevent Astro from processing the script and causing TypeScript errors). The component uses `define:vars` to pass `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables
- Updated `src/layouts/Layout.astro` to import and render `<PostHog />` inside `<head>` — ensuring PostHog is initialized on every page of the site
- Added event capture scripts to key pages and navigation components using `is:inline` scripts and `window.posthog?.capture()`
- Environment variables `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` written to `.env` (gitignore coverage ensured)
- Build verified: all 5 pages built successfully with zero errors

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' CTA on the hero section of the homepage | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the 'Read the Docs' secondary CTA on the hero section of the homepage | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA button (Starter or Pro) — includes `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' button on the Enterprise pricing card | `src/pages/pricing.astro` |
| `pricing_page_viewed` | User views the pricing page — top of the pricing conversion funnel | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card — includes `section` property (e.g. Getting Started, API Reference) | `src/pages/docs.astro` |
| `features_page_viewed` | User views the features page — indicates product evaluation intent | `src/pages/features.astro` |

## Next steps

We attempted to build an "Analytics basics" dashboard with 5 insights for you, but the API key provided for this run does not have `dashboard:write` or `insight:write` scopes. Once you have a key with the required scopes (or via the PostHog UI), we recommend creating the following insights:

1. **CTA Conversion Funnel** — Funnel from `pricing_page_viewed` → `pricing_plan_clicked` to see your pricing page conversion rate
2. **Top CTA Clicks Over Time** — Trend of `cta_clicked` + `nav_get_started_clicked` to monitor primary CTA engagement
3. **Pricing Plan Breakdown** — `pricing_plan_clicked` broken down by `plan` property to see which plan attracts the most interest
4. **Docs Engagement by Section** — `docs_section_clicked` broken down by `section` to understand which documentation topics resonate
5. **Features vs Pricing Page Views** — Trend comparing `features_page_viewed` vs `pricing_page_viewed` to understand the evaluation-to-consideration funnel

Visit your [PostHog project](https://us.posthog.com/project/2) to create these insights and a dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
