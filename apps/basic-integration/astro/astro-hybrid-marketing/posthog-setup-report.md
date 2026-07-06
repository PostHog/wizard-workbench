# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site. The integration adds client-side analytics via a `posthog.astro` snippet component included in the root layout, server-side tracking via a `posthog-node` singleton in API routes, and user identification on contact form submission. Events are tracked on all key conversion points: CTA buttons on the home page and navigation, pricing plan selection, and the contact form (both client-side on submit and server-side on receipt). Error tracking is wired into the contact API route.

| Event Name | Description | File |
|---|---|---|
| `free_trial_cta_clicked` | User clicks the "Start Free Trial" CTA button on the home page hero. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" CTA link on the home page hero. | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the main navigation bar. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User views the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA button on a pricing plan card. | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form on the contact page. | `src/pages/contact.astro` |
| `contact_form_received` | Contact form data is successfully received and processed on the server. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1807608)
- [Lead Conversion Funnel](https://us.posthog.com/project/483112/insights/RwTnEHrG) — Funnel from pricing page → plan CTA → contact form submission
- [CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/LKBHc8La) — Free trial, contact sales, and nav CTA engagement trends
- [Pricing Plan Interest](https://us.posthog.com/project/483112/insights/KdGdssnX) — Which pricing plan (starter/pro/enterprise) gets the most clicks
- [Contact Form Submissions](https://us.posthog.com/project/483112/insights/NLmNXUCb) — Client vs server form submission counts over time
- [Contact Interest Breakdown](https://us.posthog.com/project/483112/insights/jNNNJgYV) — Distribution of contact submissions by interest type

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration only identifies on contact form submission; if you add login flows later, ensure returning sessions also call `posthog.identify`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
