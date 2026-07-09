<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro View Transitions marketing site. It installed `posthog-js`, added an inline PostHog initialization component guarded by `window.__posthog_initialized`, mounted that component in the shared layout, configured automatic pageview capture with `capture_pageview: 'history_change'`, added local environment variables for the PostHog token and host, and instrumented key marketing interactions across the homepage, navigation, pricing, features, docs, about, and footer surfaces.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures when a visitor clicks a primary conversion call to action. | `src/pages/index.astro` |
| `docs_cta_clicked` | Captures when a visitor clicks through to documentation from the homepage hero. | `src/pages/index.astro` |
| `nav_cta_clicked` | Captures when a visitor clicks the main navigation conversion call to action. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | Captures when a visitor selects a pricing plan or sales contact action. | `src/pages/pricing.astro` |
| `feature_card_selected` | Captures which product feature card a visitor engages with. | `src/pages/features.astro` |
| `docs_topic_selected` | Captures which documentation topic a visitor opens from the docs overview page. | `src/pages/docs.astro` |
| `about_stats_viewed` | Captures when a visitor reaches the company proof points section on the about page. | `src/pages/about.astro` |
| `footer_link_clicked` | Captures when a visitor uses a footer navigation link. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825318
- Insight: Primary CTA clicks by location (wizard) — https://us.posthog.com/project/483112/insights/UtJMDrZ8
- Insight: Pricing plan selections (wizard) — https://us.posthog.com/project/483112/insights/Z2Vj0ALH
- Insight: Docs topic engagement (wizard) — https://us.posthog.com/project/483112/insights/vJGkRzt7
- Insight: Feature interest mix (wizard) — https://us.posthog.com/project/483112/insights/dk8VNKwd
- Insight: Marketing engagement funnel (wizard) — https://us.posthog.com/project/483112/insights/Mre2BfSx

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
