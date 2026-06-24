# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI Astro hybrid marketing site. Client-side tracking is provided via a `posthog.astro` snippet component embedded in the shared `Layout.astro`, so every page automatically initialises PostHog. A server-side singleton (`src/lib/posthog-server.ts`) using `posthog-node` handles event capture in the server-rendered API route. The contact form flow is fully instrumented end-to-end: a client-side event fires when the user submits the form, the session and distinct IDs are forwarded to the API route via request headers, and the server captures a completion or error event while also calling `identify` with the user's email and name. User identification is wired up client-side on successful form submission as well, linking the anonymous PostHog session to a known identity.

| Event name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicks the "Start Free Trial" CTA button on the home page hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the home page hero section. | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA button on the pricing page. | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form on the client side. | `src/pages/contact.astro` |
| `contact_form_completed` | Contact form was successfully processed server-side. | `src/pages/api/contact.ts` |
| `contact_form_error` | Contact form processing failed due to a server-side error. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Dashboard — Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- [Lead conversion funnel](https://us.posthog.com/project/483112/insights/iICL07if)
- [CTA engagement over time](https://us.posthog.com/project/483112/insights/BjZ53dRd)
- [Pricing plan selection breakdown](https://us.posthog.com/project/483112/insights/Ettw3tef)
- [Successful leads over time](https://us.posthog.com/project/483112/insights/bI5i9Cf1)
- [Contact form errors (reliability)](https://us.posthog.com/project/483112/insights/W5Iykfid)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh form submission can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
