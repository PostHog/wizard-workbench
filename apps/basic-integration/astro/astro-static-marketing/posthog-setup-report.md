<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro static marketing site by installing `posthog-js`, adding an inline Astro PostHog bootstrap component, wiring it into the shared layout, setting `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`, and instrumenting high-value marketing interactions across homepage CTAs, pricing, docs, about, navigation, footer interactions, and client-side error capture.

| Event name | Description | File |
| --- | --- | --- |
| `trial_cta_clicked` | Captures when a visitor clicks a free-trial call to action from the homepage hero. | `src/pages/index.astro` |
| `docs_cta_clicked` | Captures when a visitor clicks the homepage documentation call to action. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures when a visitor selects a pricing tier call to action. | `src/pages/pricing.astro` |
| `pricing_viewed` | Captures when a visitor reaches the pricing page as a funnel entry point. | `src/pages/pricing.astro` |
| `feature_interest_clicked` | Captures when a visitor clicks a feature card to explore interest in a product capability. | `src/pages/features.astro` |
| `docs_topic_selected` | Captures when a visitor chooses a documentation topic card. | `src/pages/docs.astro` |
| `about_metric_highlight_clicked` | Captures when a visitor clicks a company metric card on the about page. | `src/pages/about.astro` |
| `team_member_highlight_clicked` | Captures when a visitor clicks a team member card on the about page. | `src/pages/about.astro` |
| `navigation_link_clicked` | Captures when a visitor uses primary site navigation. | `src/components/Navigation.astro` |
| `navigation_cta_clicked` | Captures when a visitor clicks the primary navigation call to action. | `src/components/Navigation.astro` |
| `footer_link_clicked` | Captures when a visitor uses a footer link for deeper site exploration. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825316
- Insight: Homepage CTA clicks (wizard) — https://us.posthog.com/project/483112/insights/pN0PvtJC
- Insight: Pricing conversion funnel (wizard) — https://us.posthog.com/project/483112/insights/KbUh3dIa
- Insight: Pricing plans selected by tier (wizard) — https://us.posthog.com/project/483112/insights/pRShsYyt
- Insight: Documentation topic interest (wizard) — https://us.posthog.com/project/483112/insights/qzQFhbqJ
- Insight: Navigation engagement by destination (wizard) — https://us.posthog.com/project/483112/insights/bzfUbrcY

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
