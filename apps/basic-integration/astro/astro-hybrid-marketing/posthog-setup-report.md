<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Astro hybrid marketing site (NeuralFlow AI). Client-side analytics are loaded via a `posthog.astro` snippet component injected into the shared `Layout.astro`. A server-side `posthog-node` singleton (`src/lib/posthog-server.ts`) tracks contact form submissions from the API route, with session and distinct ID headers passed from the browser to correlate client and server events. Users are identified by email on contact form submission — both client-side (`posthog.identify`) and server-side (`posthog.identify`). Error capture is included client-side via `captureException` and server-side via `$exception` events.

| Event | Description | File |
|-------|-------------|------|
| `free_trial_started` | User clicks the Start Free Trial CTA button on the homepage hero or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the Contact Sales button on the homepage hero or pricing Enterprise plan. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA button on a specific pricing plan card (includes `plan` property). | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicks the Get Started button in the navigation bar. | `src/components/Navigation.astro` |
| `contact_form_submitted` | Server receives a valid contact form submission (includes `interest` and `company` properties). | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1795652)
- [CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/smwfrTw4)
- [Contact Form Submissions](https://us.posthog.com/project/483112/insights/NB7uqwaP)
- [Lead Conversion Funnel](https://us.posthog.com/project/483112/insights/1pOarX37)
- [Pricing Plan CTA Clicks by Plan](https://us.posthog.com/project/483112/insights/rxx0a3NJ)
- [Total Leads Generated](https://us.posthog.com/project/483112/insights/41GWUHWc)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the contact form identifies on submission, but users who return without re-submitting the form will remain on anonymous distinct IDs until they submit again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
