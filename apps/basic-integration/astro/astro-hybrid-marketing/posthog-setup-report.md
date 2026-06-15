# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). The integration adds client-side event tracking via the PostHog JS snippet and server-side tracking via `posthog-node`, covering the full conversion funnel from landing on the features page through to contact form submission.

**New files created:**
- `src/components/posthog.astro` — PostHog JS snippet component (uses `is:inline` to avoid Astro TypeScript processing)
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side API routes
- `.env` — PostHog public token and host environment variables

**Existing files modified:**
- `src/layouts/Layout.astro` — Imports and mounts the `<PostHog />` component in `<head>` so every page is tracked
- `src/components/Navigation.astro` — Tracks `get_started_clicked` when the nav CTA is clicked
- `src/pages/index.astro` — Tracks `free_trial_started` and `contact_sales_clicked` from the hero section
- `src/pages/pricing.astro` — Tracks `pricing_plan_selected` (with plan name) and plan-specific events for each pricing tier
- `src/pages/features.astro` — Tracks `features_page_viewed` as the top of the conversion funnel
- `src/pages/contact.astro` — Tracks `contact_form_submitted` on successful submission; passes the PostHog session ID header to the server for session continuity
- `src/pages/api/contact.ts` — Tracks `contact_lead_received` server-side (via `posthog-node`), using the email as `distinctId` and forwarding the client session ID for correlation

---

## Events

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicks a "Start Free Trial" CTA (homepage hero) | `src/pages/index.astro` |
| `free_trial_started` | User clicks "Start Free Trial" on the Pro pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" (homepage hero or Enterprise plan) | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a plan CTA on the pricing page; includes `plan` and `price_usd` properties | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicks "Get Started" in the site navigation | `src/components/Navigation.astro` |
| `features_page_viewed` | User lands on the features page — top of conversion funnel | `src/pages/features.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_lead_received` | Server-side capture of a contact form submission with lead details | `src/pages/api/contact.ts` |

---

## Next steps

Create a dashboard named **"Analytics basics (wizard)"** in PostHog with these five recommended insights:

1. **Conversion Funnel** — `features_page_viewed` → `pricing_plan_selected` → `contact_form_submitted` (Funnel insight)
2. **Free Trial Starts over time** — Trend of `free_trial_started` events
3. **Contact Form Submissions over time** — Trend of `contact_form_submitted` (client) and `contact_lead_received` (server) events
4. **Pricing Plan Breakdown** — `pricing_plan_selected` broken down by the `plan` property
5. **CTA Click Comparison** — `free_trial_started` vs `contact_sales_clicked` vs `get_started_clicked` side by side

Navigate to your PostHog project at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create these.

---

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
