<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro hybrid rendering). The integration adds both client-side and server-side event tracking without altering the existing architecture.

**Changes made:**

- Created `src/components/posthog.astro` — PostHog JS snippet component using `is:inline` to avoid TypeScript processing errors.
- Updated `src/layouts/Layout.astro` — imported and rendered `<PostHog />` in the `<head>` of every page.
- Created `src/lib/posthog-server.ts` — singleton `getPostHogServer()` function for server-side PostHog node client.
- Updated `src/pages/api/contact.ts` — added `contact_form_received` server-side event capture and user identify call; passes session/distinct ID headers from client.
- Updated `src/pages/index.astro` — added `cta_clicked` events on "Start Free Trial" and "Contact Sales" buttons.
- Updated `src/pages/pricing.astro` — added `pricing_plan_selected` events on all plan CTA buttons.
- Updated `src/pages/contact.astro` — added `contact_form_submitted` and `contact_form_error` events, plus `posthog.identify()` on successful submission.
- Created `.env` — added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.
- Installed `posthog-node` package for server-side tracking.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | Fired when a user clicks a primary CTA button (Start Free Trial, Contact Sales, Get Started) | `src/pages/index.astro` |
| `pricing_plan_selected` | Fired when a user clicks the action button on a pricing plan card | `src/pages/pricing.astro` |
| `contact_form_submitted` | Fired client-side when the contact form submits successfully | `src/pages/contact.astro` |
| `contact_form_received` | Fired server-side when the contact API route confirms a valid submission | `src/pages/api/contact.ts` |
| `contact_form_error` | Fired client-side when the contact form submission fails | `src/pages/contact.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- [Contact form submissions over time](https://us.posthog.com/project/483112/insights/qG3WlAO6)
- [Marketing conversion funnel](https://us.posthog.com/project/483112/insights/no3KwQsu)
- [Pricing plan interest breakdown](https://us.posthog.com/project/483112/insights/nKPUuwzD)
- [Contact form errors over time](https://us.posthog.com/project/483112/insights/7QjGJvEV)
- [Contact form submissions by interest](https://us.posthog.com/project/483112/insights/aSAah2Tj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the contact form only identifies on fresh submission; returning sessions may need identify called again on page load if you store the user's identity client-side.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
