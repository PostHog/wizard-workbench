<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Client-side tracking is initialized in every page via a reusable `posthog.astro` component embedded in `Layout.astro`. Server-side tracking uses a singleton `posthog-node` client in `src/lib/posthog-server.ts`, called from the contact form API route. User identity is established on both the client and server when a visitor submits the contact form, using their email address as the distinct ID and the PostHog session ID to correlate client and server events.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | Homepage hero CTA button clicked (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_viewed` | User views the pricing page — high purchase intent signal | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a CTA on a specific pricing plan (Starter, Pro, Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Client-side: contact form submitted successfully; user identified by email | `src/pages/contact.astro` |
| `contact_form_submitted` | Server-side: contact form received by API; user identified and correlated via session ID | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795653)
- [CTA Clicks over time](https://us.posthog.com/project/483112/insights/bB9syCi9)
- [Pricing Page Views](https://us.posthog.com/project/483112/insights/f75aPiJ5)
- [Pricing Plan Clicks by Plan](https://us.posthog.com/project/483112/insights/VfbieyE7)
- [Marketing Conversion Funnel](https://us.posthog.com/project/483112/insights/og30Wj6U)
- [Contact Form Submissions](https://us.posthog.com/project/483112/insights/YrgKXPpV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
