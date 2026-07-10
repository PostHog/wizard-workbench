<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro static marketing site with PostHog. It added a reusable inline PostHog initialization component, wired it into the shared layout, configured Astro public environment variables for the PostHog project token and host, installed the PostHog web SDK package, and instrumented marketing engagement events across homepage CTAs, navigation, pricing, features, docs, footer, and about-page proof points. It also created a PostHog dashboard plus five saved insights focused on conversion intent and content engagement.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures clicks on primary marketing call-to-action buttons across the site. | `src/pages/index.astro` |
| `docs_cta_clicked` | Captures clicks from the homepage hero to the documentation section. | `src/pages/index.astro` |
| `navigation_cta_clicked` | Captures clicks on the navigation Get Started call to action. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | Captures which pricing plan visitors choose to explore from the pricing page. | `src/pages/pricing.astro` |
| `feature_interest_selected` | Captures which feature card visitors interact with on the features page. | `src/pages/features.astro` |
| `docs_topic_selected` | Captures which documentation topic visitors open from the docs page. | `src/pages/docs.astro` |
| `footer_link_clicked` | Captures clicks on footer navigation links to understand lower-funnel browsing. | `src/components/Footer.astro` |
| `about_stat_engaged` | Captures clicks on company proof-point stats on the about page. | `src/pages/about.astro` |
| `team_profile_selected` | Captures clicks on leadership cards on the about page. | `src/pages/about.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831015)
- [Primary CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/zbXeiw7q)
- [Pricing plan selections (wizard)](https://us.posthog.com/project/483112/insights/iUe3wtQM)
- [Docs topic engagement (wizard)](https://us.posthog.com/project/483112/insights/k2exvqGZ)
- [Feature interest trend (wizard)](https://us.posthog.com/project/483112/insights/HObB7B2b)
- [CTA to pricing funnel (wizard)](https://us.posthog.com/project/483112/insights/iPNktVW7)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
