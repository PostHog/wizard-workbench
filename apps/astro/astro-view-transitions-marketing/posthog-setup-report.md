<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site — an Astro application using View Transitions (ClientRouter). Here's a summary of all changes made:

## Integration Summary

### New files created
- **`src/components/posthog.astro`** — PostHog web snippet component using `is:inline` to prevent TypeScript errors. Includes the `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking across view transitions. Reads API key and host from environment variables via `define:vars`.
- **`.env`** — Environment file with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` (gitignore-covered).

### Modified files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>`, so analytics loads on every page.
- **`src/pages/index.astro`** — Added inline script tracking `cta_clicked` (hero "Start Free Trial") and `docs_cta_clicked` (hero "Read the Docs"), using `DOMContentLoaded` + `astro:page-load` listeners for view transition compatibility.
- **`src/pages/pricing.astro`** — Added inline script tracking `pricing_plan_selected` for Starter and Pro plan buttons (with `plan` and `price_usd` properties), and `enterprise_contact_clicked` for the Enterprise "Contact Sales" button.
- **`src/components/Navigation.astro`** — Added inline script tracking `nav_cta_clicked` for the "Get Started" nav CTA.
- **`src/pages/docs.astro`** — Added inline script tracking `docs_section_clicked` for each documentation section card (with `section` and `section_title` properties).

### Dependency installed
- **`posthog-js`** v1.351.3 — PostHog JavaScript SDK

## Instrumented Events

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a plan CTA on the pricing page (Starter or Pro) | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | User clicks "Contact Sales" on the Enterprise pricing card | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |

## Next steps

To complete your analytics setup, we recommend creating a dashboard in PostHog with the following insights:

1. **CTA Conversion Funnel** — Funnel from `$pageview` → `cta_clicked` / `nav_cta_clicked` → `pricing_plan_selected`
2. **Pricing Plan Selection** — Trend of `pricing_plan_selected` broken down by `plan` property
3. **CTA Clicks Over Time** — Trends for `cta_clicked`, `nav_cta_clicked`, and `docs_cta_clicked`
4. **Enterprise Interest** — Trend for `enterprise_contact_clicked`
5. **Docs Section Engagement** — Trend for `docs_section_clicked` broken down by `section`

Visit [https://us.posthog.com](https://us.posthog.com) to create these insights in your project.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
