<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). Client-side tracking is delivered via a reusable `posthog.astro` snippet component included in the shared `Layout.astro`, ensuring every page loads PostHog automatically. A server-side singleton (`src/lib/posthog-server.ts`) using `posthog-node` handles event capture in the contact API route, with session IDs passed from the browser via the `X-PostHog-Session-Id` header to maintain session continuity between client and server. User identification is performed on the client side after a successful contact form submission, and the same email is used as the `distinctId` for the corresponding server-side event.

| Event name | Description | File |
|---|---|---|
| `free_trial_started` | User clicked the Start Free Trial CTA on the homepage hero or pricing page | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the Contact Sales button on the homepage | `src/pages/index.astro` |
| `pricing_page_viewed` | User viewed the pricing page — top of purchase conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked a CTA on the Starter or Enterprise pricing plan | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicked the Get Started CTA in the site navigation | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form successfully processed by the server (server-side) | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1777407)
- [Pricing to Trial Funnel](https://us.i.posthog.com/project/483112/insights/gb141pE7)
- [Contact Form Submissions Over Time](https://us.i.posthog.com/project/483112/insights/ejMpdoLD)
- [Pricing Plan Selection Breakdown](https://us.i.posthog.com/project/483112/insights/vmAKgsm8)
- [Acquisition CTAs Over Time](https://us.i.posthog.com/project/483112/insights/xQlwPP0d)
- [Contact Sales Clicks Total](https://us.i.posthog.com/project/483112/insights/a8m5UErx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
