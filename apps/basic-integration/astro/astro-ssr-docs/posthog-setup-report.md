<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow documentation site (Astro SSR). PostHog is now initialised on every page via a reusable `posthog.astro` component embedded in the root layout. Key user interactions across the landing page, navigation, and documentation pages are captured as named events. A server-side PostHog singleton (`posthog-node`) was created, and a new API route records documentation page feedback events with session correlation.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" CTA on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes `card_title` and `destination` properties) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the nav bar | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" nav CTA | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page (top of conversion funnel) | `src/pages/docs/quickstart.astro` |
| `doc_feedback_submitted` | Server-side: user submits "Was this helpful?" feedback on any docs page (includes `helpful`, `page`, `$session_id` properties) | `src/pages/api/events/doc-feedback.ts` |

## Next steps

Create a dashboard in PostHog to monitor key user behaviours. Visit your [Dashboards page](https://us.posthog.com/project/2/dashboard) and add insights for:

1. **Get Started CTA conversion** — Trends for `get_started_clicked` over time
2. **Feature card popularity** — Trends for `feature_card_clicked` broken down by `card_title`
3. **Quickstart funnel** — Funnel: `get_started_clicked` → `quickstart_viewed`
4. **Doc feedback rating** — Trends for `doc_feedback_submitted` broken down by `helpful`
5. **GitHub interest** — Trends for `github_link_clicked` over time

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
