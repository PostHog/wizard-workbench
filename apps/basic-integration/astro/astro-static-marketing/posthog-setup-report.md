# PostHog post-wizard report

The wizard has completed a deep integration of the NeuralFlow AI marketing site. PostHog analytics has been initialized and six custom events have been instrumented across the site's key interaction points.

## Integration summary

### Changes made

- **`src/components/posthog.astro`** — New component that initializes the PostHog JavaScript SDK using `is:inline` to bypass Astro's TypeScript processing. Reads credentials from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/layouts/Layout.astro`** — PostHog component imported and added to the `<head>` section so it loads on every page.
- **`src/pages/index.astro`** — Two hero-section events instrumented (`hero_cta_clicked`, `hero_docs_clicked`).
- **`src/pages/pricing.astro`** — Pricing CTA event instrumented with `plan` property (`pricing_cta_clicked`).
- **`src/components/Navigation.astro`** — Navigation CTA event instrumented (`nav_get_started_clicked`).
- **`src/pages/docs.astro`** — Documentation section click event instrumented with `section` property (`docs_section_clicked`).
- **`src/components/Footer.astro`** — Footer link click event instrumented with `link` property (`footer_link_clicked`).
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values.

## Events tracked

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks 'Start Free Trial' button in the homepage hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks 'Read the Docs' link in the homepage hero section | `src/pages/index.astro` |
| `pricing_cta_clicked` | User clicks a pricing plan call-to-action button on the pricing page | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' button in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks on a documentation section card on the docs page | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a link in the site footer | `src/components/Footer.astro` |

## Next steps

We've built a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/2/dashboard/1720023)

The dashboard is pre-populated with insights covering:
1. **Pricing CTA Clicks by Plan** — Breakdown of `pricing_cta_clicked` by the `plan` property
2. **Hero CTA Funnel** — Funnel from `$pageview` → `hero_cta_clicked`
3. **Top Docs Sections** — Breakdown of `docs_section_clicked` by the `section` property
4. **Nav vs Hero CTA Comparison** — Trend comparing `nav_get_started_clicked` and `hero_cta_clicked`
5. **Footer Link Clicks** — Breakdown of `footer_link_clicked` by the `link` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`).
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
