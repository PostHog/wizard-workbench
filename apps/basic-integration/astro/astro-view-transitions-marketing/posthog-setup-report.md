<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Here is a summary of every change made:

- **`src/components/posthog.astro`** (new file): PostHog initialization component using the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during Astro view transitions. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on soft navigation. Environment variables are passed via `define:vars`.
- **`src/layouts/Layout.astro`** (edited): Imported the new `PostHog` component and placed it in `<head>` alongside `<ViewTransitions />`, ensuring PostHog loads on every page.
- **`src/pages/index.astro`** (edited): Added IDs to the hero CTA buttons and a `<script is:inline>` block that captures `free_trial_started` and `docs_cta_clicked` events on click, using the `astro:page-load` pattern for view transitions.
- **`src/pages/pricing.astro`** (edited): Added IDs to all three pricing plan buttons and a `<script is:inline>` block that fires `pricing_viewed` on page load, `pricing_plan_clicked` (with `plan` and `price` properties) for Starter/Pro, and `contact_sales_clicked` for Enterprise.
- **`src/components/Navigation.astro`** (edited): Added an ID to the nav "Get Started" CTA and a `<script is:inline>` block that captures `nav_cta_clicked` on click.
- **`src/pages/docs.astro`** (edited): Added `data-docs-section` attributes to each documentation card and a `<script is:inline>` block that captures `docs_section_clicked` with a `section` property on click.
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables written via the wizard-tools MCP.

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_viewed` | User viewed the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked Get Started / Start Free Trial on a pricing tier (`plan`, `price` props) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise tier | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a docs section card (`section` prop) | `src/pages/docs.astro` |

## Next steps

The PostHog MCP API key is missing the `query:read`, `insight:write`, and `dashboard:write` scopes needed to auto-create dashboards. You can create an **"Analytics basics"** dashboard manually in PostHog with the following recommended insights:

1. **Conversion funnel** — `pricing_viewed` → `pricing_plan_clicked` → `free_trial_started`: shows your top-of-funnel conversion rate from pricing page view to trial start.
2. **CTA click trends** — Trend of `free_trial_started`, `nav_cta_clicked`, and `contact_sales_clicked` over time: tracks which CTAs are driving the most engagement.
3. **Pricing plan breakdown** — `pricing_plan_clicked` broken down by `plan` property: shows which tier (Starter vs Pro) users prefer.
4. **Docs engagement** — `docs_section_clicked` broken down by `section` property: reveals which documentation topics attract the most interest.
5. **Hero vs Nav CTA** — `free_trial_started` vs `nav_cta_clicked` trend comparison: measures the relative effectiveness of hero versus navigation CTAs.

Navigate to [your PostHog project dashboards](/dashboard) to create these.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
