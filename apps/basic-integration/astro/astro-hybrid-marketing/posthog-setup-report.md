<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI marketing site. The integration covers client-side event tracking across all marketing pages, server-side tracking via the contact API route, user identification on contact form submission, and error capture.

## Files changed

| File | Change |
|------|--------|
| `src/components/posthog.astro` | **Created** — PostHog JS snippet component using `is:inline` and env vars |
| `src/layouts/Layout.astro` | **Updated** — imports and renders `<PostHog />` in `<head>` for all pages |
| `src/lib/posthog-server.ts` | **Created** — singleton `getPostHogServer()` for `posthog-node` |
| `src/pages/index.astro` | **Updated** — captures `cta_clicked` and `contact_sales_clicked` on hero button clicks |
| `src/pages/pricing.astro` | **Updated** — captures `pricing_plan_selected` (with `plan` property) on each plan CTA |
| `src/pages/contact.astro` | **Updated** — captures `contact_form_submitted`, `contact_form_error`; calls `posthog.identify()` and `posthog.captureException()` on network errors; passes session/distinct ID headers to API |
| `src/pages/api/contact.ts` | **Updated** — imports `getPostHogServer`; captures `contact_form_submission_received`; calls `posthog.identify()` with name + company; calls `posthog.captureException()` on server errors |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' hero CTA | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the 'Contact Sales' hero button | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (starter / pro / enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form submitted successfully (client-side) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission returned an error | `src/pages/contact.astro` |
| `contact_form_submission_received` | Server received and validated a contact form submission | `src/pages/api/contact.ts` |

## Next steps

We've built a dashboard and insights to track user behaviour based on the events instrumented above:

- **Dashboard:** https://us.posthog.com/project/483112/dashboard/1824431
- **CTA and Contact Sales clicks:** https://us.posthog.com/project/483112/insights/XA009K4H
- **Pricing plan selections by plan:** https://us.posthog.com/project/483112/insights/hfKahQQq
- **Contact form conversion funnel:** https://us.posthog.com/project/483112/insights/Ege1Sn9d
- **Contact form submissions over time:** https://us.posthog.com/project/483112/insights/X5EWhaJp

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on contact form submission; if users arrive with an existing session, identify should be called on page load too.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
