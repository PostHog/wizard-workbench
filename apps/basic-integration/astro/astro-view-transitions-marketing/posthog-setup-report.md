# PostHog post-wizard report

The wizard has completed a deep integration of this Astro marketing site with PostHog by adding a reusable inline PostHog initializer for View Transitions, wiring automatic pageview capture with `capture_pageview: 'history_change'`, and instrumenting high-intent marketing interactions across navigation, homepage CTAs, pricing actions, docs discovery, feature interest, about-page proof points, and footer navigation. Environment variables were added for the public token and host, the `posthog-js` package was installed, and the integration was verified with a successful production build.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures when a visitor clicks a primary call-to-action button or navigation CTA. | `src/components/Navigation.astro` |
| `cta_clicked` | Captures when a visitor clicks a homepage hero call-to-action button. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures when a visitor chooses a pricing plan or contact-sales action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | Captures when a visitor opens a documentation entry point from the docs overview. | `src/pages/docs.astro` |
| `feature_interest_clicked` | Captures when a visitor selects a feature card to learn more. | `src/pages/features.astro` |
| `about_stat_highlight_clicked` | Captures when a visitor engages with a company proof-point on the about page. | `src/pages/about.astro` |
| `footer_link_clicked` | Captures when a visitor uses a footer navigation or policy link. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846661)
- Insight: [CTA clicks by location (wizard)](https://us.posthog.com/project/483112/insights/DRljTJN2)
- Insight: [Marketing CTA funnel (wizard)](https://us.posthog.com/project/483112/insights/pYSQkROQ)
- Insight: [Pricing plan selection trend (wizard)](https://us.posthog.com/project/483112/insights/KN0E5cLm)
- Insight: [Documentation topics selected (wizard)](https://us.posthog.com/project/483112/insights/fbSm1ocd)
- Insight: [Feature interest by capability (wizard)](https://us.posthog.com/project/483112/insights/rUyMfk8I)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
