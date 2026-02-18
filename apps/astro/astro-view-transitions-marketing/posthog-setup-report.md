<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro marketing site (View Transitions / ClientRouter mode). Here's a summary of all changes made:

- **`src/components/posthog.astro`** *(new)* — PostHog web snippet component using `is:inline` to prevent Astro TypeScript processing. Wraps initialization with `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on every route change. API key and host are passed via `define:vars` from environment variables.
- **`src/layouts/Layout.astro`** *(modified)* — Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog is initialized on every page across the site.
- **`src/pages/index.astro`** *(modified)* — Tracks hero CTA and docs CTA button clicks using `astro:page-load` + `DOMContentLoaded` event pattern for View Transitions compatibility.
- **`src/pages/pricing.astro`** *(modified)* — Tracks pricing page view, plan selection (starter/pro), and enterprise contact sales clicks.
- **`src/pages/features.astro`** *(modified)* — Tracks features page view as a funnel entry point.
- **`src/pages/docs.astro`** *(modified)* — Tracks clicks on individual documentation section cards.
- **`src/components/Navigation.astro`** *(modified)* — Tracks "Get Started" CTA clicks in the top navigation bar.
- **`.env`** *(new)* — `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` added and covered by `.gitignore`.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks "Start Free Trial" hero CTA (`location`, `label` properties) | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" hero CTA (`location`, `label` properties) | `src/pages/index.astro` |
| `pricing_viewed` | User visits the Pricing page — key conversion funnel step | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (`plan`, `price_monthly`, `label` properties) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on Enterprise plan (`plan` property) | `src/pages/pricing.astro` |
| `features_viewed` | User visits the Features page — top of conversion funnel | `src/pages/features.astro` |
| `docs_section_clicked` | User clicks a docs section card (`section`, `label` properties) | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the nav bar (`location` property) | `src/components/Navigation.astro` |

## Next steps

The PostHog API key in this environment has read-only scope, so the dashboard and insights below couldn't be created automatically. To create them, visit PostHog and build an **"Analytics basics"** dashboard with these five recommended insights:

1. **Conversion Funnel: Features → Pricing → CTA** — Funnel insight with steps: `features_viewed` → `pricing_viewed` → `pricing_plan_selected` (tracks top-of-funnel progression to conversion)
2. **CTA Clicks by Location** — Trends comparing `cta_clicked`, `nav_get_started_clicked`, and `docs_cta_clicked` (shows which CTA drives most engagement)
3. **Pricing Plan Selection Breakdown** — Trends on `pricing_plan_selected` broken down by the `plan` property (shows starter vs pro popularity)
4. **Docs Section Engagement** — Trends on `docs_section_clicked` broken down by the `section` property (shows which docs sections users explore most)
5. **Daily Active Visitors** — Trends on `$pageview` (overall traffic trend, auto-tracked by PostHog)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
